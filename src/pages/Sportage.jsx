import React, { useState } from "react";
import {
  MapPinIcon,
  CheckCircleIcon,
  UserCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import {
  BeakerIcon,
  HashtagIcon,
  IdentificationIcon,
  CubeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  UserGroupIcon,
  CheckIcon as CheckOutlineIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

// Import car images
import Sportage1 from "../assets/cars/sportage1.png";
import Sportage3 from "../assets/cars/sportage3.png";
import Sportage4 from "../assets/cars/sportage4.png";
import Sportage5 from "../assets/cars/sportage5.png";
import Sportage6 from "../assets/cars/sportage6.png";
import Sportage7 from "../assets/cars/sportage7.png";
import Sportage8 from "../assets/cars/sportage8.png";
import Sportage9 from "../assets/cars/sportage9.png";

function Sportage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Use imported images instead of string paths
  const images = [
    Sportage4,
    Sportage3,
    Sportage5,
    Sportage6,
    Sportage7,
    Sportage8,
    Sportage9,
  ];

  // Fix the swipe direction logic
  const handleSwipe = (offset) => {
    if (offset.x > 0) {
      setCurrentImageIndex(
        currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
      );
    } else {
      setCurrentImageIndex((currentImageIndex + 1) % images.length);
    }
  };

  // WhatsApp contact handler
  const handleWhatsAppContact = () => {
    // WhatsApp API link with predefined message
    const whatsappLink =
      "https://wa.me/50687050594?text=Hola,%20estoy%20interesado%20en%20el%20Kia%20Sportage%202012";
    window.open(whatsappLink, "_blank");
  };

  // WhatsApp contact handler for sellers
  const handleWhatsAppSeller = () => {
    // WhatsApp API link with predefined message for sellers
    const whatsappLink =
      "https://wa.me/50670231439?text=Hola,%20estoy%20interesado%20en%20publicar%20mi%20auto%20en%20venta";
    window.open(whatsappLink, "_blank");
  };

  // Navigation handlers for slider
  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };

  // Calculate progress percentage based on current image
  const progressWidth = `${((currentImageIndex + 1) / images.length) * 100}%`;

  return (
    <div className="bg-white min-h-screen md:flex md:flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-800"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.8 2 11 2 11.3V15c0 .6.4 1 1 1h1" />
                <path d="M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              </svg>
              <span className="text-xl font-bold text-blue-900">Buymycar</span>
            </div>
            <button
              onClick={() => setDialogOpen(true)}
              className="bg-blue-800 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full text-sm transition duration-150"
            >
              Vender
            </button>
          </div>
        </div>
      </header>

      {/* Sell Your Car Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        className="relative z-50"
      >
        <Dialog.Backdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6 text-blue-800"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.8 2 11 2 11.3V15c0 .6.4 1 1 1h1" />
                    <path d="M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                    <path d="M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    ¿Quieres vender tu auto?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Te ayudamos a vender tu auto con un anuncio igual a este,
                      contáctanos por WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleWhatsAppSeller}
                  className="inline-flex w-full justify-center items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  <ChatBubbleLeftRightIcon className="size-5" />
                  Contactar por WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      {/* Content wrapper */}
      <div className="md:px-8 md:py-4">
        {/* Header with "En venta" and location icon */}
        <div className="py-4 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-green-500 flex items-center gap-2 md:text-3xl">
              <CheckCircleIcon className="size-5 text-green-500" /> Disponible
            </h1>
            <div className="flex items-center gap-1 mt-1 text-gray-600">
              <UserCircleIcon className="size-4" />
              <p className="text-xs">Vendedor verificado</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <MapPinIcon className="size-5 text-navy-900" />
            <p className="text-sm text-navy-900">Cartago</p>
          </div>
        </div>

        {/* Main content */}
        <div className="md:flex md:gap-8 md:mt-4">
          {/* Left column - Image slider */}
          <div className="md:w-1/2 md:flex-shrink-0 flex flex-col items-center">
            {/* Car Image Slider - Updated with 3:4 aspect ratio */}
            <div className="w-full aspect-[3/4] relative overflow-hidden md:rounded-lg max-w-md mx-auto">
              {/* Previous button - Desktop only */}
              <button
                onClick={goToPrevious}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/80 text-navy-900 hover:bg-white transition shadow-md"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>

              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(e, { offset, velocity }) => {
                  if (Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500) {
                    handleSwipe(offset);
                  }
                }}
                className="w-full h-full relative cursor-grab active:cursor-grabbing bg-gray-50"
              >
                <AnimatePresence initial={false}>
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={`Kia Sportage 2012 image ${currentImageIndex + 1}`}
                    className="w-[100%] h-[100%] p-2 rounded-xl object-cover absolute"
                    initial={{
                      opacity: 0,
                      x: 300 * (currentImageIndex === 0 ? 1 : -1),
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: -300 * (currentImageIndex === 0 ? 1 : -1),
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </motion.div>

              {/* Next button - Desktop only */}
              <button
                onClick={goToNext}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/80 text-navy-900 hover:bg-white transition shadow-md"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>

              {/* Image indicator dots */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Progress indicator - Dynamic and animated */}
            <div className="flex mt-4 w-full max-w-md">
              <motion.div
                className="h-1 bg-blue-800 rounded-l"
                initial={{ width: 0 }}
                animate={{ width: progressWidth }}
                transition={{ duration: 0.3 }}
              ></motion.div>
              <motion.div
                className="h-1 bg-gray-200 rounded-r"
                initial={{ width: "100%" }}
                animate={{ width: `calc(100% - ${progressWidth})` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>

            <button
              onClick={handleWhatsAppContact}
              className="relative hidden * mt-8 md:inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full md:max-w-md"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center gap-1 justify-center rounded-full bg-white px-3 py-1 text-base font-medium text-navy-800 backdrop-blur-3xl">
                <ChatBubbleLeftRightIcon className="size-5" /> Contactar
              </span>
            </button>

            {/* Additional information box - Desktop only */}
            <div className="hidden md:block w-full max-w-md mt-8">
              <div className="bg-white shadow-md rounded-lg p-4 border border-gray-100">
                <h4 className="text-navy-900 font-semibold mb-3 text-lg">
                  Información adicional
                </h4>

                <div className="space-y-3">
                  {/* Vendedor verificado */}
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckOutlineIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-navy-900 font-medium">
                        Vendedor verificado
                      </p>
                      <p className="text-sm text-gray-500">
                        Identidad confirmada
                      </p>
                    </div>
                  </div>

                  {/* Costos de traspaso */}
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                      <XMarkIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-navy-900 font-medium">
                        Costos de traspaso
                      </p>
                      <p className="text-sm text-gray-500">
                        No incluidos en el precio
                      </p>
                    </div>
                  </div>

                  {/* Test-drive */}
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckOutlineIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-navy-900 font-medium">Test-drive</p>
                      <p className="text-sm text-gray-500">
                        Disponible previa cita
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Details */}
          <div className="md:w-1/2">
            {/* Car title and price */}
            <div className="p-4 md:px-0 md:pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 md:text-4xl">
                    Kia Sportage
                  </h2>
                  <p className="text-xl text-gray-400 md:text-2xl">2012</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-0">
                    <div className="rounded-full  p-2">
                      <p className="font-bold text-lg">₡</p>
                    </div>
                    <p className="text-xl font-semibold md:text-2xl">
                      6 000 000
                    </p>
                  </div>
                  <p className="text-navy-800 text-sm -mt-2">Contado</p>
                </div>
              </div>
            </div>

            {/* Considerations */}
            <div className="px-4 pb-2 md:px-0">
              <h3 className="text-xl font-bold text-navy-900 mb-2 md:text-2xl">
                Descripción
              </h3>
              <p className="text-navy-900 md:text-lg">
                El carro se encuentra en excelente estado tanto por fuera como
                por dentro. Cuenta con pantalla táctil nueva y parlantes nuevos.
                Poco kilometraje y muy bien cuidado.
              </p>
            </div>

            <div className="px-4 pb-2 md:px-0">
              <img
                src={Sportage1}
                alt="Kia Sportage"
                className="w-full my-10 object-contain"
              />
            </div>

            {/* Car specs grid */}
            <div className="grid grid-cols-3 gap-4 px-4 py-2 md:px-0 md:gap-4 md:mt-4">
              {/* Gas type */}
              <div className="bg-gray-100 p-3 rounded-lg md:p-4 shadow-lg">
                <div className="flex justify-start mb-2">
                  <BeakerIcon className="h-5 w-5 text-blue-800" />
                </div>
                <p className="text-gray-400 text-sm md:text-base">
                  Combustible
                </p>
                <p className="text-navy-900 font-bold md:text-lg">Gasolina</p>
              </div>

              {/* Mileage */}
              <div className="bg-gray-100 p-3 rounded-lg md:p-4 shadow-lg">
                <div className="flex justify-start mb-2">
                  <HashtagIcon className="h-5 w-5 text-blue-800" />
                </div>
                <p className="text-gray-400 text-sm md:text-base">
                  Kilometraje
                </p>
                <p className="text-navy-900 font-bold md:text-lg">92 000</p>
              </div>

              {/* License plate */}
              <div className="bg-gray-100 p-3 rounded-lg md:p-4 shadow-lg">
                <div className="flex justify-start mb-2">
                  <IdentificationIcon className="h-5 w-5 text-blue-800" />
                </div>
                <p className="text-gray-400 text-sm md:text-base">Placa</p>
                <p className="text-navy-900 font-bold md:text-lg">SCS144</p>
              </div>

              {/* Engine size */}
              <div className="bg-gray-100 p-3 rounded-lg md:p-4 shadow-lg">
                <div className="flex justify-start mb-2">
                  <CubeIcon className="h-5 w-5 text-blue-800" />
                </div>
                <p className="text-gray-400 text-sm md:text-base">Cilindraje</p>
                <p className="text-navy-900 font-bold md:text-lg">2000cc</p>
              </div>

              {/* Transmission */}
              <div className="bg-gray-100 p-3 rounded-lg md:p-4 shadow-lg">
                <div className="flex justify-start mb-2">
                  <CogIcon className="h-5 w-5 text-blue-800" />
                </div>
                <p className="text-gray-400 text-sm md:text-base">
                  Transmisión
                </p>
                <p className="text-navy-900 font-bold md:text-lg">Manual</p>
              </div>

              {/* Passengers */}
              <div className="bg-gray-100 p-3 rounded-lg md:p-4 shadow-lg   ">
                <div className="flex justify-start mb-2">
                  <UserGroupIcon className="h-5 w-5 text-blue-800" />
                </div>
                <p className="text-gray-400 text-sm md:text-base">Pasajeros</p>
                <p className="text-navy-900 font-bold md:text-lg">5</p>
              </div>
            </div>

            {/* Additional vehicle information box - Mobile only */}
            <div className="px-4 py-4 md:hidden">
              <div className="w-full bg-white shadow-md rounded-lg p-4 border border-gray-100">
                <h4 className="text-navy-900 font-semibold mb-3 text-lg">
                  Información adicional
                </h4>

                <div className="space-y-3">
                  {/* Vendedor verificado */}
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckOutlineIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-navy-900 font-medium">
                        Vendedor verificado
                      </p>
                      <p className="text-sm text-gray-500">
                        Identidad confirmada
                      </p>
                    </div>
                  </div>

                  {/* Costos de traspaso */}
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                      <XMarkIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-navy-900 font-medium">
                        Costos de traspaso
                      </p>
                      <p className="text-sm text-gray-500">
                        No incluidos en el precio
                      </p>
                    </div>
                  </div>

                  {/* Test-drive */}
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckOutlineIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-navy-900 font-medium">Test-drive</p>
                      <p className="text-sm text-gray-500">
                        Disponible previa cita
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional considerations - Desktop moved up in the order */}
            <div className="px-4 mt-6 md:px-0">
              <h3 className="text-xl font-bold text-navy-900 mb-2 md:text-2xl">
                Consideraciones
              </h3>

              <div className="mb-3 md:mb-4">
                <p className="text-navy-900 font-bold md:text-lg">
                  Aire acondicionado:
                </p>
                <p className="text-navy-900 md:text-lg">
                  El aire frío funciona bien sin embargo, el caliente se ha
                  desconectado.
                </p>
              </div>
              <div className="mb-3 md:mb-4">
                <p className="text-navy-900 font-bold md:text-lg">
                  Tapas de aros:
                </p>
                <p className="text-navy-900 md:text-lg">
                  De momento no cuenta con las tapas de los aros.
                </p>
              </div>
            </div>

            {/* Contact button */}
            <div className="px-4 py-6 md:px-0 bottom-0 w-full sticky md:hidden">
              <button
                onClick={handleWhatsAppContact}
                className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full md:max-w-xs"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full gap-1 cursor-pointer items-center justify-center rounded-full bg-white px-3 py-1 text-base font-medium text-navy-800 backdrop-blur-3xl">
                  <ChatBubbleLeftRightIcon className="size-5" /> Contactar
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sportage;
