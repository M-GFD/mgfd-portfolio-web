import { Inter } from "next/font/google";

// Usamos Inter como fallback ya que Inclusive Sans no está en next/font/google
// La fuente Inclusive Sans se cargará via Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inclusive-sans",
});

export { inter };