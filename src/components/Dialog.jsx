import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

export default function DialogX({ open, setOpen, theme }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        className={` ${theme} relative z-20 animate-fade`}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 dark:bg-zinc-950 bg-zinc-300 bg-opacity-80 dark:bg-opacity-80 transition-opacity backdrop-blur-2xl" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl  bg-white dark:bg-zinc-950 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block"></div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-geomanist font-semibold leading-6 text-gray-900 dark:text-zinc-300"
                    >
                      Comunícate con nosotros
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm font-geomanist text-gray-500 dark:text-gray-400">
                        Escríbenos para consultar nuestros servicios y agendar
                        una reunión para encontrar la mejor solución de software
                        para tu empresa.
                      </p>
                      <div className="flex space-x-2 mt-3 items-center">
                        <EnvelopeIcon className="h-5 w-5 hover:cursor-pointer text-zinc-950 dark:text-zinc-300 hover:opacity-50" />
                        <a
                          href="mailto:aruiz@lobsterlabs.net"
                          className="hover:cursor-pointer hover:underline hover:text-zinc-950 dark:hover:text-white text-gray-500 dark:text-gray-400 font-geomanist text-sm"
                        >
                          aruiz@lobsterlabs.net
                        </a>
                      </div>
                      <div className="flex space-x-2 mt-2 items-center">
                        <PhoneIcon className="h-5 w-5 hover:cursor-pointer text-zinc-950 dark:text-zinc-300 hover:opacity-50" />
                        <a
                          href="https://wa.me/50687050594?text=Hola%20Lobster%20Labs,
                          "
                          target="_blank"
                          className="hover:cursor-pointer hover:underline hover:text-zinc-950 dark:hover:text-white text-gray-500 dark:text-gray-400 font-geomanist text-sm"
                        >
                          +506 8705-0594
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-zinc-950  dark:bg-zinc-900 dark:text-white px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-85 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    De acuerdo
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
