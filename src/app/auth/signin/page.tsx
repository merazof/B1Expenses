import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { LockIcon, MailIcon } from "lucide-react";
import LoginForm from "@/components/Auth/LoginForm";

export const metadata: Metadata = {
  title: "B1 Expenses",
  description: "Aplicación para la gestión de tus gastos e ingresos",
};

const SignIn: React.FC = () => {
  return (
    <div className="h-screen rounded-sm  bg-white shadow-default  dark:bg-boxdark">
      <div className="flex h-full items-center justify-center">
        {/* <div className="hidden bg-[url('/images/background/Bg.svg')] xl:block xl:h-screen xl:w-1/2 "> */}
        <div className="hidden h-full w-full bg-gradient-to-r from-blue-500 to-purple-900 xl:block xl:w-1/2 ">
          <div className="flex h-full flex-col items-start justify-center px-26 py-17.5 text-left font-bold text-white xl:p-15 2xl:p-40">
            <h2 className="mb-5 text-title-lg ">
              Aplicación para la gestión de tus gastos e ingresos
            </h2>
            <h4 className="mb-10 text-lg">
              Administra las finanzas de tu empresa de forma fácil, intuitiva y
              eficaz, sin necesidad de ser un experto en economía o en
              tecnología.
            </h4>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Ver video
            </Link>
          </div>
        </div>
        <div className="h-full w-full border-stroke dark:border-strokedark xl:h-screen xl:w-1/2  xl:border-l-2 ">
          <div className="flex h-full w-full flex-col items-center justify-center p-4 sm:p-12 xl:p-10 2xl:p-40">
            <Image
              // className="hover:animate-bounce"
              src={"/images/logo.svg"}
              alt="Logo"
              width={120}
              height={120}
            />

            <h2 className="my-4 text-title-md font-bold text-primary dark:text-white sm:my-2 sm:text-title-md">
              Hola, bienvenido de nuevo
            </h2>
            <h3 className="mb-7 font-medium sm:mb-5">
              Introduce tus credenciales para continuar
            </h3>
            <div className="w-full p-3 sm:px-10">
              <div>
                <LoginForm />
              </div>
              <div className="mt-6 text-center">
                <p>
                  ¿Olvidaste tu contraseña?{" "}
                  <Link href="/auth/forgot-password" className="text-primary">
                    La olvidé
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
