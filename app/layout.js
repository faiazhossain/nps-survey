import { Tiro_Bangla } from "next/font/google";
import "./globals.css";

const tiroBangla = Tiro_Bangla({
  weight: "400",
  subsets: ["bengali"],
});

export const metadata = {
  title: "NPS Survey App",
  description: "Mobile survey application for NPS data collection",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: "no",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='bn'>
      <body className={`${tiroBangla.className} bg-gray-50`}>{children}</body>
    </html>
  );
}
