import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { GoTrophy } from "react-icons/go";
import { UserIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { TbPlayVolleyball } from "react-icons/tb";
import { GiPodiumWinner } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

function NewTournament() {
  const navigate = useNavigate();
  const [tournamentName, setTournamentName] = useState("");
  const [players, setPlayers] = useState([""]);
  const [error, setError] = useState("");

  const handleAddPlayer = () => {
    setPlayers([...players, ""]);
  };

  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = value;
    setPlayers(updatedPlayers);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredPlayers = players.filter((player) => player.trim() !== "");

    if (filteredPlayers.length < 4) {
      alert("Se requieren al menos 4 jugadores para crear un torneo");
      return;
    }

    // Check for duplicate player names
    const uniqueNames = new Set(filteredPlayers);
    if (uniqueNames.size !== filteredPlayers.length) {
      alert("No se permiten nombres de jugadores duplicados");
      return;
    }

    // Navigate to SortTeams with tournament data
    navigate("/spikeball/sort-teams", {
      state: {
        tournamentName: tournamentName,
        players: filteredPlayers,
      },
    });
  };

  const validPlayers = players.filter((player) => player.trim() !== "").length;
  const isValid = validPlayers >= 4 && tournamentName.trim() !== "";

  return (
    <div className="bg-white min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold">SpikeBall</h1>
      <h1 className="text-lg font-bold mb-8 flex items-center gap-2">
        Nuevo Torneo
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-6">
          <label
            htmlFor="tournamentName"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Nombre del Torneo
          </label>
          <div className="mt-2 grid grid-cols-1">
            <input
              id="tournamentName"
              name="tournamentName"
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              placeholder="Torneo de SpikeBall"
              className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6"
              required
            />
            <GoTrophy
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
            />
          </div>
        </div>

        <h2 className="text-base font-semibold mb-2">Jugadores</h2>

        {players.map((player, index) => (
          <div key={index} className="mb-4">
            <label
              htmlFor={`player-${index}`}
              className="block text-sm/6 font-medium text-gray-900"
            >
              Jugador {index + 1}
            </label>
            <div className="mt-2 grid grid-cols-1">
              <input
                id={`player-${index}`}
                type="text"
                value={player}
                onChange={(e) => handlePlayerChange(index, e.target.value)}
                placeholder="Nombre"
                className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6"
                required={index < 4}
              />
              <TbPlayVolleyball
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddPlayer}
          className="mt-2 mb-6 flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Agregar otro jugador
        </button>

        <button
          type="submit"
          className="w-full rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Crear Equipos
        </button>
      </form>
    </div>
  );
}

export default NewTournament;
