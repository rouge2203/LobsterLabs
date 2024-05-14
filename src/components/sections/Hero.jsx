import React from "react";
import { AuroraBackground } from "../aurora-background";
import { ThreeDCardDemo } from "../3d-card2";
import { CardBody, CardContainer, CardItem } from "../3d-card";
import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GiftIcon,
  CircleStackIcon,
  DocumentChartBarIcon,
  BookOpenIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import Navbar from "../Navbar";
import Catalyst from "../../assets/img/catalyst.png";

const Hero = () => {
  return (
    <div
      id="herosection"
      className="w-full transition-all duration-300 bg-zinc-900  "
    >
      <div className="sm:hidden">
        <Navbar
          textColor={"gray-400"}
          ringColor={"gray-400"}
          hoverTextColor={"text-white"}
          hoverBgColor={"bg-gray-700"}
        />
      </div>

      {/* AuroroBackground */}
      <AuroraBackground>
        <div className="hidden sm:block">
          <Navbar
            textColor={"gray-400"}
            ringColor={"gray-400"}
            hoverTextColor={"text-white"}
            hoverBgColor={"gray-700"}
          />
        </div>
        <div className="flex flex-col lg:flex-row mb-32 lg:h-auto  lg:mt-10 lg:w-4/4  mt-8 md:px-12 px-2  ">
          <div className=" lg:flex lg:flex-col lg:w-1/2 lg:py-10 lg:pl-40 ">
            <h1 className="text-4xl md:text-5xl mb-7  font-varien font-normal mt-2 relative  bg-clip-text text-transparent text-center lg:text-start bg-gradient-to-b from-neutral-200 to-neutral-500">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-lobsterRed to-neutral-800 ">
                Lobster
              </span>{" "}
              Labs
            </h1>

            <p className="text-md md:text-lg lg:mt-0 lg:ml-4 md:mx-10 mx-5 lg:mx-0  text-center lg:text-start font-inter  font-extralight  text-slate-100">
              Explora soluciones de software innovadoras y elegantes diseñadas
              para simplificar y optimizar tus operaciones.
            </p>
            <ul className="hidden lg:grid grid-cols-2 gap-2 md:gap-4 md:text-xl mt-5 lg:mt-10  font-inter w-full font-extralight mx-3 text-slate-100">
              <li className="flex items-center">
                <DevicePhoneMobileIcon
                  className="h-6 w-6 mr-2 animate-pulse"
                  aria-hidden="true"
                />
                Apps móviles
              </li>
              <li className="flex items-center">
                <ComputerDesktopIcon
                  className="h-6 w-6 mr-2 animate-pulse"
                  aria-hidden="true"
                />
                Aplicaciones web
              </li>
              <li className="flex items-center">
                <GiftIcon
                  className="h-6 w-6 mr-2 animate-pulse"
                  aria-hidden="true"
                />
                Planes de Lealtad
              </li>
              <li className="flex items-center">
                <CircleStackIcon
                  className="h-6 w-6 mr-2 animate-pulse"
                  aria-hidden="true"
                />
                Integraciones con SoftLand
              </li>
              <li className="flex items-center">
                <DocumentChartBarIcon
                  className="h-6 w-6 mr-2 animate-pulse"
                  aria-hidden="true"
                />
                Sistemas administrativos
              </li>
              <li className="flex items-center">
                <BookOpenIcon
                  className="h-6 w-6 mr-2 animate-pulse"
                  aria-hidden="true"
                />
                Catálogos virtuales
              </li>
              <li className="flex items-center">
                <CreditCardIcon
                  className="h-6 w-6 mr-2 animate-pulse"
                  aria-hidden="true"
                />
                Ecommerce
              </li>
            </ul>
          </div>
          <div className="mx-3 mt-5 lg:w-1/2  ">
            <CardContainer className="font-inter ">
              <CardBody className="bg-gray-50 relative group/card shadow-2xl shadow-white  dark:hover:shadow-2xl dark:hover:shadow-white dark:bg-zinc-900 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  Transforma tu negocio con Lobster
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  Nos encargaremos de hacer que tu negocio sea más moderno
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <img
                    src={Catalyst}
                    width="1000"
                    className="h-80  w-full rounded-b-md group-hover/card:shadow-xl"
                    alt="thumbnail"
                  />
                </CardItem>
                <div className="flex justify-between items-center mt-7">
                  <CardItem
                    translateZ={20}
                    as="p"
                    href="https://twitter.com/mannupaaji"
                    target="__blank"
                    className="hidden lg:flex px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  >
                    Mueve el mouse aquí
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as="p"
                    href="https://twitter.com/mannupaaji"
                    target="__blank"
                    className="lg:hidden px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  >
                    Toca aquí
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Contáctenos
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>
        </div>
      </AuroraBackground>
    </div>
  );
};

export default Hero;
