import React, { useState, useEffect } from "react";
import { AuroraBackground } from "../aurora-background";
import Logo from "../../assets/img/logo.png";
import { TypewriterEffectSmooth } from "../typewriter-effect";
import { HoverBorderGradient } from "../hover-border-gradient";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { MultiStepLoader } from "../multi-step-loader";
import DialogX from "../Dialog";

function Landing() {
  const [showLoader, setShowLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const words = [
    { text: "Transforma", className: "dark:text-zinc-300" },
    { text: "tu", className: "dark:text-zinc-300" },
    { text: "negocio", className: "dark:text-zinc-300" },
    { text: "con", className: "dark:text-zinc-300" },
    {
      text: "Lobster",
      className: "dark:text-lobsterRed2 font-varien font-normal",
    },
  ];
  const loaderStates = [
    { text: "Aplicaciones web" },
    { text: "Apps móviles" },
    { text: "Planes de lealtad" },
    { text: "Integraciones con SoftLand" },
    { text: "Sistemas administrativos" },
    { text: "Catálogos virtuales" },
    { text: "Ecommerce" },
    { text: "Manejo de redes sociales" },
    { text: "Google Ads" },
    { text: "Soluciones en software" },
    // Add more steps as needed
  ];

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        setShowLoader(false); // Hide loader after last step
      }, loaderStates.length * 1000); // Assuming `duration` is 1000ms per step

      return () => clearTimeout(timer);
    }
  }, [showLoader, loaderStates.length]);

  return (
    <div id="herosection" className="w-full transition-all duration-300">
      <AuroraBackground>
        <div className=" flex text-white text-center h-screen items-center justify-center">
          {/* navbar */}
          <div className="absolute top-0 w-full h-14 flex items-center justify-between px-5">
            <div className="flex space-x-2 items-center">
              <img
                src={Logo}
                alt="Lobster Labs Logo"
                className="h-6 w-7 md:h-7 md:w-8"
              />
              <span className="text-xl md:text-2xl font-varien dark:text-zinc-300 hover:cursor-pointer mt-1 lg:mt-0">
                Lobster Labs
              </span>
            </div>
            <div className="flex space-x-5 text-md font-geomanist text-gray-500 font-semibold">
              <a
                href="mailto:aruiz@lobsterlabs.net?subject=Solicitud%20de%20Información&body=Hola,%20equipo%20de%20Lobster%20Labs.%20Me%20gustaría%20recibir%20más%20información%20acerca%20de%20sus%20servicios."
                className="hover:cursor-pointer hover:text-gray-300"
              >
                <EnvelopeIcon className="h-6 w-6 hover:cursor-pointer hover:text-zinc-300" />
              </a>
              <a
                href="https://wa.me/50687050594?text=Hola,%20equipo%20de%20Lobster%20Labs.%20Me%20gustaría%20recibir%20más%20información."
                className="hover:cursor-pointer hover:text-zinc-300"
                target="_blank"
              >
                <PhoneIcon className="h-6 w-6 hover:cursor-pointer hover:text-gray-300" />
              </a>
            </div>
          </div>
          {/* navbar end */}

          {/* content */}
          <div className="relative flex flex-col w-full items-center justify-center">
            <img
              src={Logo}
              alt="Lobster Labs Logo"
              className=" animate-fade animate-delay-[3500ms] h-24 lg:h-20 absolute bottom-[calc(100%+40px)] left-1/2 transform -translate-x-1/2"
            />
            <span className="animate-fade animate-delay-[3500ms] text-xs md:text-sm lg:text-md 2xl:text-lg font-geomanist text-gray-400 font-semibold mx-8 md:px-0 md:w-1/2  lg:px-0 lg:w-1/3 ">
              Explora soluciones de software innovadoras y elegantes diseñadas
              para simplificar y optimizar tus operaciones.
            </span>
            <div className="">
              <TypewriterEffectSmooth
                words={words}
                cursorClassName="dark:bg-lobsterRed2"
                className=""
              />
            </div>
            <div className="flex space-x-3 animate-fade animate-delay-[4000ms]">
              <HoverBorderGradient
                onClick={() => {
                  setShowLoader(true);
                }}
                className="dark:bg-zinc-950 w-32  dark:hover:bg-zinc-950/50"
              >
                <button className="font-geomanist dark:text-zinc-300">
                  Servicios
                </button>
              </HoverBorderGradient>
              <HoverBorderGradient
                className="dark:bg-zinc-950 w-32 dark:hover:bg-zinc-950/50 "
                onClick={() => {
                  setOpen(true);
                }}
              >
                <button className="font-geomanist dark:text-zinc-300">
                  Contáctenos
                </button>
              </HoverBorderGradient>
            </div>
          </div>
          {/* content end */}
        </div>
        {showLoader && (
          <MultiStepLoader
            loadingStates={loaderStates}
            loading={true}
            duration={1000} // Duration each step is shown, adjust as necessary
            loop={false} // Set to true if you want the loader to loop
          />
        )}
        {open && <DialogX open={open} setOpen={setOpen} />}
      </AuroraBackground>
    </div>
  );
}

export default Landing;
