import localFont from "next/font/local";
import "./globals.css";
import Header from "./Global/Header/Header";
import Footer from "./Global/Footer/Footer";
import Donate from "./Global/Components/Donate";
import SocialMediaSidebar from "./Global/Sidebaar/sidebaar";
import { Martel,Roboto } from "next/font/google";
const martel = Martel({
  subsets: ['latin'],
  weight: ['400', '700'], // Adjust weights as needed
  display: 'swap',        // Choose your preferred display setting
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'], // Adjust weights as needed
  display: 'swap',        // Choose your preferred display setting
});

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
  title: "Kalantar Art Foundation",
  description: `
  Kalantar Art Foundation ais a well-known non-profit organization working towards a huge social re-engineering process by way of art-based activities (both - for privileged and underprivileged sections of the society). Our art programmes include (but are not limited to):

 
For the Privileged Section:

CTC (Colors Transforming the Corporates) : Art based Behavioural Trainings for the Corporates
Art over Coffee : Small get togethers provoking the hidden art within us
Mix Media : Art Exchange Programmes
 
For the underprivileged section:

कलादीक्षा – free art education in slums and villages
कला प्रसार – promoting art through seminars and conferences
कारागार के कलाकार – motivational and employment based art sessions for the prison inmates
देश का प्रथम (आदर्श) कला ग्राम – making of the 1st Art Village of the country (and in process of making many more)

We invite you to be a part of this mission
Free Art Education, Art Programs for Prison Inmates, Art Seminars, National Level Art Festivals and Competitions, Training the 64 arts from the Vedas, Trainings related to Painting, Music, Dance, Theatre, Creative Writing and others, Social re-engineering by way of art practices, Mental Wellness Advisery, Corporate Trainings, and Organizational Behavior Consulting
  `,
  verification: {
    google: "m6DGyaFuO1ijIRWnJDZlyIH8yJBNyD5TEeU0Vc1RGUQ",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body
        className={` ${roboto.className}  ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        {/* <SocialMediaSidebar/> */}
        <Donate />
        <Footer />
      </body>

    </html>
  );
}
