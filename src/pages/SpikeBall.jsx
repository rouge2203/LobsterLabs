import React, { useState, useEffect } from "react";
import { TbPlayVolleyball } from "react-icons/tb";
import { GoTrophy } from "react-icons/go";
import { GiPodiumWinner } from "react-icons/gi";
import { Link } from "react-router-dom";
import Ballpit from "../components/Ballpit";
import { Dialog } from "@headlessui/react";
import { BookOpenIcon } from "@heroicons/react/24/outline";

function SpikeBall() {
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);

  return (
    <div className="relative bg-white h-screen w-screen overflow-hidden">
      {/* Ballpit Background */}
      <div className="absolute inset-0 z-0">
        <Ballpit
          followCursor={true}
          count={window.innerWidth >= 1024 ? 150 : 50}
          colors={[0x35a3ff, 0xff2a6f, 0xffb84d]}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center">
        {/* Rules Button (top right) */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setRulesDialogOpen(true)}
            className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 shadow-md"
            title="Reglas del Torneo"
          >
            <BookOpenIcon className="w-6 h-6 text-gray-600 cursor-pointer z-100" />
          </button>
        </div>
        <TbPlayVolleyball className="w-1/2 lg:w-1/4 h-auto" />
        <h1 className="text-4xl font-bold text-black">SpikeBall</h1>
        <Link
          to="/spikeball/new-tournament"
          type="button"
          className="rounded-md mt-4 mb-2 flex items-center gap-2 bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs "
        >
          <GoTrophy className="w-4 h-4" /> Nuevo Torneo
        </Link>
        <Link
          to="/spikeball/tournaments"
          type="button"
          className="rounded-md flex items-center gap-2 bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs "
        >
          <GiPodiumWinner className="w-4 h-4" /> Torneos
        </Link>
      </div>

      {/* Rules Dialog */}
      <Dialog
        open={rulesDialogOpen}
        onClose={() => setRulesDialogOpen(false)}
        className="relative z-20"
      >
        <Dialog.Backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />

        <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gray-100">
                  <BookOpenIcon
                    aria-hidden="true"
                    className="size-6 text-amber-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    Reglas del Juego
                  </Dialog.Title>
                  <div className="mt-4 text-left">
                    <div className="text-sm text-gray-500 space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Formato del Torneo
                      </h4>
                      <p>
                        Los torneos utilizan un formato de cola continua, donde:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          El equipo ganador permanece en la cancha para el
                          siguiente partido.
                        </li>
                        <li>El equipo perdedor va al final de la cola.</li>
                        <li>
                          Los equipos que no han jugado recientemente tienen
                          prioridad.
                        </li>
                        <li>
                          Se muestran estadísticas en tiempo real de victorias y
                          partidos jugados.
                        </li>
                        <li>
                          El torneo continúa hasta que el organizador lo
                          finalice manualmente.
                        </li>
                      </ul>
                      <h4 className="font-medium text-gray-900 mt-4">
                        Racha ganadora
                      </h4>
                      <p>
                        Los equipos con rachas de 2 o más victorias consecutivas
                        se muestran con un indicador de fuego (🔥).
                      </p>
                      <h4 className="font-medium text-gray-900 mt-4">
                        Sistema de puntuación
                      </h4>
                      <p>
                        Los partidos se juegan a un solo set. El equipo con
                        mayor puntuación gana el partido.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setRulesDialogOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                >
                  Entendido
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default SpikeBall;
