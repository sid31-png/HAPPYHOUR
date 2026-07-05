import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Feather from "@expo/vector-icons/Feather";
import { activateOffer } from "@happyhour/api";
import type { OfferRedemption, OfferWithContext } from "@happyhour/types";
import { colors, fonts, fontSizes, formatQAR } from "@happyhour/ui";
import { GlassSurface } from "./GlassSurface";
import { CTAButton } from "./CTAButton";
import { useThemeSky } from "../theme/useThemeSky";
import { useAuth } from "../lib/auth-context";
import { getSupabase } from "../lib/supabase";
import { useCountdownSeconds, formatCountdownClock } from "../hooks/useCountdown";

type Step = "idle" | "activating" | "active" | "error";

interface OfferActivationSheetProps {
  offer: OfferWithContext | null;
  onClose: () => void;
}

/**
 * Déblocage d'offre (mécanique 1, CLAUDE.md section 4) : un tap génère un code + QR
 * valables 15 minutes, à montrer au serveur. Respecte la règle des 3 taps — tap sur
 * l'offre pour ouvrir cette sheet, puis un seul tap de confirmation pour débloquer.
 */
export function OfferActivationSheet({ offer, onClose }: OfferActivationSheetProps) {
  const { textColor, isDark } = useThemeSky();
  const { session } = useAuth();
  const [step, setStep] = useState<Step>("idle");
  const [redemption, setRedemption] = useState<OfferRedemption | null>(null);
  const [simulatedRedeemed, setSimulatedRedeemed] = useState(false);

  if (!offer) return null;

  function handleDismiss() {
    setStep("idle");
    setRedemption(null);
    setSimulatedRedeemed(false);
    onClose();
  }

  async function handleActivate() {
    if (!session?.user) return;
    const client = getSupabase();
    if (!client || !offer) return;
    setStep("activating");
    try {
      const result = await activateOffer(client, session.user.id, offer);
      setRedemption(result);
      setStep("active");
    } catch {
      setStep("error");
    }
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={handleDismiss}>
      <Pressable style={styles.backdrop} onPress={handleDismiss}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <GlassSurface shape="card" style={styles.sheet}>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>{offer.discount_label}</Text>
                <Pressable onPress={handleDismiss} hitSlop={8} accessibilityRole="button" accessibilityLabel="Fermer">
                  <Feather name="x" size={22} color={textColor} style={{ opacity: 0.7 }} />
                </Pressable>
              </View>
              <Text style={[styles.venueName, { color: textColor }]}>{offer.venue.name}</Text>

              {step === "idle" && (
                <>
                  <Text style={[styles.body, { color: textColor }]}>
                    Débloquez cette offre exclusive : un code et un QR valables 15 minutes s'affichent, à
                    montrer au serveur sur place.
                  </Text>
                  <CTAButton
                    label={session?.user ? "Débloquer l'offre" : "Se connecter pour débloquer"}
                    onPress={handleActivate}
                    style={{ marginTop: 6 }}
                  />
                </>
              )}

              {step === "activating" && (
                <CTAButton label="Génération du code…" loading disabled style={{ marginTop: 6 }} />
              )}

              {step === "error" && (
                <Text style={[styles.body, { color: "#C24D4D" }]}>
                  Une erreur est survenue, merci de réessayer.
                </Text>
              )}

              {step === "active" && redemption && (
                <RedemptionView
                  redemption={redemption}
                  isDark={isDark}
                  textColor={textColor}
                  simulatedRedeemed={simulatedRedeemed}
                  onSimulateRedeemed={() => setSimulatedRedeemed(true)}
                />
              )}
            </View>
          </GlassSurface>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function RedemptionView({
  redemption,
  isDark,
  textColor,
  simulatedRedeemed,
  onSimulateRedeemed,
}: {
  redemption: OfferRedemption;
  isDark: boolean;
  textColor: string;
  simulatedRedeemed: boolean;
  onSimulateRedeemed: () => void;
}) {
  const secondsLeft = useCountdownSeconds(redemption.expires_at);
  const expired = secondsLeft <= 0;

  if (simulatedRedeemed) {
    return (
      <View style={styles.stateWrapper}>
        <Feather name="check-circle" size={40} color={colors.liveGreen} />
        <Text style={[styles.stateTitle, { color: textColor }]}>Offre utilisée</Text>
        <Text style={[styles.body, { color: textColor, textAlign: "center" }]}>
          Économie enregistrée : {formatQAR(redemption.saving_amount)}.
        </Text>
      </View>
    );
  }

  if (expired) {
    return (
      <View style={styles.stateWrapper}>
        <Feather name="clock" size={36} color={textColor} style={{ opacity: 0.6 }} />
        <Text style={[styles.stateTitle, { color: textColor }]}>Offre expirée</Text>
        <Text style={[styles.body, { color: textColor, textAlign: "center" }]}>
          La fenêtre de 15 minutes est terminée. Revenez sur le lieu pour débloquer une nouvelle offre.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.qrWrapper}>
      <View style={[styles.qrCard, { backgroundColor: "#FFFFFF" }]}>
        <QRCode value={redemption.qr_payload} size={160} />
      </View>
      <Text style={[styles.code, { color: textColor }]}>{redemption.code}</Text>
      <View style={styles.timerPill}>
        <Feather name="clock" size={13} color={colors.goldDeep} />
        <Text style={styles.timerText}>{formatCountdownClock(secondsLeft)}</Text>
      </View>
      <Text style={[styles.hint, { color: textColor }]}>Montrez ce code ou ce QR au serveur sur place.</Text>
      <Pressable onPress={onSimulateRedeemed} hitSlop={8} style={styles.demoLink}>
        <Text style={[styles.demoLinkText, { color: textColor }]}>Simuler la validation (démo)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: { margin: 16, marginBottom: 32 },
  content: { padding: 22, gap: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontFamily: fonts.heading, fontSize: fontSizes.h2, fontWeight: "800", flex: 1, paddingRight: 12 },
  venueName: { fontFamily: fonts.body, fontSize: fontSizes.body, opacity: 0.75 },
  body: { fontFamily: fonts.body, fontSize: fontSizes.body, lineHeight: 20, opacity: 0.9 },
  qrWrapper: { alignItems: "center", gap: 10, marginTop: 6 },
  qrCard: { padding: 16, borderRadius: 20 },
  code: { fontFamily: fonts.heading, fontSize: 28, fontWeight: "800", letterSpacing: 4 },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(245,166,35,0.16)",
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  timerText: { fontFamily: fonts.heading, fontSize: fontSizes.body, fontWeight: "700", color: colors.goldDeep },
  hint: { fontFamily: fonts.body, fontSize: fontSizes.meta, opacity: 0.7, textAlign: "center" },
  demoLink: { marginTop: 4, minHeight: 44, alignItems: "center", justifyContent: "center" },
  demoLinkText: { fontFamily: fonts.body, fontSize: fontSizes.meta, opacity: 0.5, textDecorationLine: "underline" },
  stateWrapper: { alignItems: "center", gap: 8, paddingVertical: 12 },
  stateTitle: { fontFamily: fonts.heading, fontSize: fontSizes.h2, fontWeight: "700" },
});
