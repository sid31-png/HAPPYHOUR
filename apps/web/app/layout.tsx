import type { Metadata } from "next";
import { Alegreya_Sans, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const alegreyaSans = Alegreya_Sans({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-alegreya",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

const title = "Happy Hour — Trouvez votre prochain happy hour à Doha";
const description =
  "Trouver où sortir ce soir ne devrait pas prendre 45 minutes. Happy Hour repère en direct les meilleures offres bars, cafés, rooftops et événements de Doha, avec un compte à rebours en temps réel.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    locale: "fr_FR",
    type: "website",
    siteName: "Happy Hour",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${alegreyaSans.variable} ${hankenGrotesk.variable}`}>
      <body className="min-h-screen bg-sky-light bg-fixed bg-cover text-textLight antialiased dark:bg-sky-dark dark:text-textDark font-body">
        {children}
      </body>
    </html>
  );
}
