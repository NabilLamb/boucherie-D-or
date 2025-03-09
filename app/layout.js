import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import {
  ClerkProvider,
} from '@clerk/nextjs'

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Bouchrie D'or",
  description: "E-Commerce web site for Butcher shop built with Next.js ",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body  className="outfit_ade5a21b-module__G7qryG__className antialiased text-gray-700"
        suppressHydrationWarning>
          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>

  );
}
