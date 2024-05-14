import React from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import Logo from "../assets/img/logo.png";
import { Link } from "react-scroll"; // Import Link from react-scroll

const navigation = [
  {
    name: "Inicio",
    href: "herosection",
    href2: "#herosection",
    current: false,
  },
  { name: "Soluciones", href: "whitediv", href2: "#whitediv", current: false },
  { name: "Clientes", href: "#", current: false },
  { name: "Contacto", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({
  textColor,
  ringColor,
  hoverTextColor,
  hoverBgColor,
}) {
  return (
    <Disclosure
      as="nav"
      className="bg-transparent border-b border-b-zinc-300 border-opacity-15 sm:border-opacity-0"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button*/}
              <div className="absolute inset-y-0 left-0 pl-1 flex items-center sm:hidden">
                <Disclosure.Button
                  className={`relative inline-flex items-center justify-center rounded-md p-2 text-${textColor} hover:bg-tranparent hover:text-${hoverTextColor} focus:outline-none focus:ring-2  focus:ring-${ringColor} focus:ring-offset-2 focus:ring-offset-gray-800`}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              {/* Mobile menu button END*/}

              {/* Mobile Logo area */}
              <div className="absolute inset-y-0 left-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full bg-transparent p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <img
                    className="h-8 w-auto hidden sm:block "
                    src={Logo}
                    alt="Lobster Labs"
                  />
                </button>
              </div>
              {/* Logo area END*/}

              {/* Desktop Menu */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-center">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto sm:hidden"
                    src={Logo}
                    alt="Lobster Labs"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href} // This will scroll to the element with the id provided in href
                        smooth={true} // Smooth scroll
                        offset={5} // Adjusts the final scroll position
                        duration={500} // Animation duration in milliseconds
                        className={`cursor-pointer rounded-md px-3 py-2 text-sm font-geomanist font-medium text-${textColor} hover:bg-${hoverBgColor} hover:text-${hoverTextColor}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {/* Desktop Menu END */}

              {/* Contact Button  */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-1 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className={`relative rounded-md bg-transparent p-2 text-${textColor} hover:text-${hoverTextColor} focus:outline-none focus:ring-2 focus:ring-${ringColor} focus:ring-offset-2 focus:ring-offset-gray-800`}
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Contact</span>
                  <ChatBubbleOvalLeftEllipsisIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
              {/* Contact Button END */}
            </div>
          </div>

          {/* Mobile Menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href2}
                  className={classNames(
                    item.current
                      ? "bg-red-900 text-white"
                      : `text-${textColor} hover:bg-${hoverBgColor} hover:text-${hoverTextColor}`,
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
          {/* Mobile Menu END */}
        </>
      )}
    </Disclosure>
  );
}

{
  /* <Link
                        as={Link}
                        key={item.name}
                        to={item.href} // This will scroll to the element with the id provided in href
                        smooth={true} // Smooth scroll
                        offset={5} // Adjusts the final scroll position
                        duration={500} // Animation duration in milliseconds
                        className={`cursor-pointer rounded-md px-3 py-2 text-sm font-geomanist font-medium text-${textColor} hover:bg-${hoverBgColor} hover:text-${hoverTextColor}`}
                      >
                        {item.name}
                      </Link> */
}
