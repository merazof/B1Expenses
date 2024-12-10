// "use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
// import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ToastContainer } from "react-toastify";
import ToastProvider from "@/components/ToastProvider";
import NextTopLoader from "nextjs-toploader";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: {
    template: "%s | B1 Expenses",
    default: "B1 Expenses",
  },
  description: "B1 Expenses - nueva versión",
  metadataBase: new URL("https://www.kyros.cl"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //const session = await auth();

  //console.log("session", session);
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          <div className="min-h-screen dark:bg-boxdark-2 dark:text-bodydark">
            {
              // loading ? (
              //   <Loader />
              // ) :
              <DefaultLayout>
                <NextTopLoader showSpinner={false} />
                <ToastProvider>{children}</ToastProvider>
              </DefaultLayout>
            }
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
