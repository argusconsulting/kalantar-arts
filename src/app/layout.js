import localFont from "next/font/local";
import "./globals.css";
import Header from "./Global/Header/Header";
import Footer from "./Global/Footer/Footer";
import Donate from "./Global/Components/Donate";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Kalantar Art Faoundation",
  description: "Kalantar Art Foundation is a non-profit organization that helps the under-priviledged section of the society to learn art and also promote artists",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
        {children}
        <Donate/>
        <Footer/>
      </body>
    </html>
  );
}
