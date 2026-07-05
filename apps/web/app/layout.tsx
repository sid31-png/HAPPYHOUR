import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="fr">
      <body className="min-h-screen bg-white text-textLight antialiased dark:bg-black dark:text-textDark font-body">
        {children}
      </body>
    </html>
  );
}
