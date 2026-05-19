import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CardForge | Gerador e Editor de Cartas",
  description:
    "Crie, edite e exporte cartas em massa com variáveis dinâmicas utilizando arquivos CSV.",
  keywords: [
    "card maker",
    "gerador de cartas",
    "csv",
    "design",
    "impressão em massa de cartas",
  ],
  authors: [{ name: "Lucas Oliveira" }],
  openGraph: {
    title: "CardForge | Editor de Cartas Dinâmico",
    description:
      "Gere cartas personalizadas e em lote a partir de uma planilha CSV.",
    type: "website",
    locale: "pt_BR",
    siteName: "CardForge",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
