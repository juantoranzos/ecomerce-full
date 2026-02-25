import { Geist, Geist_Mono } from "next/font/google";
import { RevocationButton } from "@/components/ui/RevocationButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: '%s | Yo Te Importo',
    default: 'Yo Te Importo - Tu tienda de confianza',
  },
  description: 'Encuentra los mejores productos importados al mejor precio. Tecnología, accesorios y más.',
  keywords: ['importados', 'tecnologia', 'ecommerce', 'argentina', 'compras online'],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://yo-te-importo.vercel.app/',
    siteName: 'Yo Te Importo',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <RevocationButton />
      </body>
    </html>
  );
}
