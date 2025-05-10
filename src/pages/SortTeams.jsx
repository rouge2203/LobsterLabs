import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TbPlayVolleyball } from "react-icons/tb";
import { GiPodiumWinner } from "react-icons/gi";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { GoTrophy } from "react-icons/go";
import { supabase } from "../lib/supabase";

function SortTeams() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tournamentName, setTournamentName] = useState("");
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tournamentModality, setTournamentModality] = useState("league");

  useEffect(() => {
    // Check if tournament data is passed through location state
    if (location.state?.tournamentName && location.state?.players) {
      setTournamentName(location.state.tournamentName);
      setPlayers(location.state.players);

      // Show loading animation for 2 seconds
      setIsLoading(true);
      setTimeout(() => {
        createRandomTeams(location.state.players);
        setIsLoading(false);
      }, 2000);
    } else {
      // Handle the case where no data is passed
      setError(
        "No tournament data provided. Please create a tournament first."
      );
      setIsLoading(false);
    }
  }, [location.state]);

  const createRandomTeams = (playerList) => {
    // Make a copy of the players array to shuffle
    const shuffledPlayers = [...playerList];

    // Simple shuffle algorithm (Fisher-Yates)
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[j]] = [
        shuffledPlayers[j],
        shuffledPlayers[i],
      ];
    }

    const newTeams = [];

    // Create teams of 2 players
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      // If we have an odd number of players and this is the last one
      if (i + 1 >= shuffledPlayers.length) {
        newTeams.push([shuffledPlayers[i], "Escoge compañero"]);
      } else {
        newTeams.push([shuffledPlayers[i], shuffledPlayers[i + 1]]);
      }
    }

    setTeams(newTeams);
  };

  const handlePlayerChange = (teamIndex, playerIndex, newPlayerName) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex][playerIndex] = newPlayerName;
    setTeams(updatedTeams);
  };

  const checkForDuplicates = () => {
    // Create a map to track players and their team assignments
    const playerOccurrences = new Map();
    // Track "Escoge compañero" occurrences
    let escogeCounts = 0;
    // Track all players assigned to teams
    const assignedPlayers = new Set();

    // Check each team
    for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
      for (
        let playerIndex = 0;
        playerIndex < teams[teamIndex].length;
        playerIndex++
      ) {
        const playerName = teams[teamIndex][playerIndex];

        // Count "Escoge compañero"
        if (playerName === "Escoge compañero") {
          escogeCounts++;
          if (escogeCounts > 1) {
            return "No puede tener más de un 'Escoge compañero' en el torneo";
          }
          continue;
        }

        // Add to assigned players set
        assignedPlayers.add(playerName);

        // Check for duplicates
        if (playerOccurrences.has(playerName)) {
          return `${playerName} está asignado a múltiples equipos.`;
        }

        playerOccurrences.set(playerName, `Equipo ${teamIndex + 1}`);
      }
    }

    // Check if any players are missing (not assigned to any team)
    const missingPlayers = players.filter((p) => !assignedPlayers.has(p));
    if (missingPlayers.length > 0) {
      return `${missingPlayers.join(", ")} no tiene${
        missingPlayers.length > 1 ? "n" : ""
      } equipo asignado.`;
    }

    return null; // No duplicates or missing players found
  };

  // Function to create league matches for a tournament
  const createLeagueMatches = (tournamentId, teams) => {
    const matches = [];
    let matchOrder = 1;

    // Generate matches for all teams against each other
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          tournament_id: tournamentId,
          team_a_id: teams[i].id,
          team_b_id: teams[j].id,
          match_order: matchOrder++,
        });
      }
    }

    return matches;
  };

  const createTournamentInSupabase = async () => {
    try {
      setIsSubmitting(true);

      // 1. Create tournament - removing date since it's set automatically in Supabase
      const { data: tournamentData, error: tournamentError } = await supabase
        .from("tournaments")
        .insert([
          {
            name: tournamentName,
            // Store tournament mode - NULL for default mode, "Liga" for league
            tournament_mode: tournamentModality === "league" ? "Liga" : null,
          },
        ])
        .select()
        .single();

      if (tournamentError) throw tournamentError;

      const tournamentId = tournamentData.id;

      // 2. Create players
      const playersToInsert = players.map((playerName) => ({
        name: playerName,
        tournament_id: tournamentId,
      }));

      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .insert(playersToInsert)
        .select();

      if (playersError) throw playersError;

      // Create a map of player names to IDs
      const playerNameToId = {};
      playersData.forEach((player) => {
        playerNameToId[player.name] = player.id;
      });

      // 3. Create teams
      const teamsToInsert = teams.map((team) => {
        // Handle special case for "Escoge compañero"
        const player1 = team[0];
        const player2 = team[1];

        return {
          player1_id: playerNameToId[player1],
          player2_id:
            player2 === "Escoge compañero" ? null : playerNameToId[player2],
          tournament_id: tournamentId,
        };
      });

      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .insert(teamsToInsert)
        .select();

      if (teamsError) throw teamsError;

      // 4. Create matches based on tournament modality
      if (tournamentModality === "winner-stays-on") {
        // Original tournament mode: first match is team 0 vs team 1
        const matchesToInsert = [];

        if (teamsData.length >= 2) {
          // First match: team 0 vs team 1
          matchesToInsert.push({
            team_a_id: teamsData[0].id,
            team_b_id: teamsData[1].id,
            tournament_id: tournamentId,
            match_order: 1,
          });
        }

        if (matchesToInsert.length > 0) {
          const { error: matchesError } = await supabase
            .from("matches")
            .insert(matchesToInsert);

          if (matchesError) throw matchesError;
        }
      } else if (tournamentModality === "league") {
        // League mode: create matches for all teams vs each other
        const leagueMatches = createLeagueMatches(tournamentId, teamsData);

        if (leagueMatches.length > 0) {
          const { error: matchesError } = await supabase
            .from("matches")
            .insert(leagueMatches);

          if (matchesError) throw matchesError;
        }
      }

      // Redirect to the tournament page
      navigate(`/spikeball/tournaments/${tournamentId}`, { replace: true });
    } catch (error) {
      console.error("Error creating tournament:", error);
      setError("Error al crear el torneo. Por favor, inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  };

  const handleStartTournament = async () => {
    setError("");
    const duplicateError = checkForDuplicates();

    if (duplicateError) {
      setError(duplicateError);
      return;
    }

    // Create tournament in Supabase
    await createTournamentInSupabase();
  };

  // Create a playerOptions array that includes all players plus "Escoge compañero" if needed
  const playerOptions = ["Escoge compañero", ...players];

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen p-8 flex flex-col items-center justify-center">
        <TbPlayVolleyball className="w-12 h-12 animate-spin" />
        <p className="mt-4">Sorteando equipos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-auto min-h-screen p-8 pb-24 flex flex-col items-center">
      <h1 className="text-4xl font-bold">SpikeBall</h1>
      <h1 className="text-lg font-medium mb-8 flex items-center gap-2">
        <TbPlayVolleyball className="w-5 h-5" />{" "}
        {tournamentName || "Equipos del Torneo"}
      </h1>

      {teams.length > 0 ? (
        <div className="w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Equipos</h2>

          {teams.map((team, teamIndex) => (
            <div
              key={teamIndex}
              className="mb-6 p-4 border rounded-md shadow-sm"
            >
              <h3 className="text-lg text-center font-medium mb-2">
                Equipo {teamIndex + 1}
              </h3>

              {team.map((player, playerIndex) => (
                <div key={playerIndex} className="mb-4">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Jugador {playerIndex + 1}
                  </label>
                  <div className="relative mt-2">
                    <Listbox
                      value={player}
                      onChange={(value) =>
                        handlePlayerChange(teamIndex, playerIndex, value)
                      }
                    >
                      <Listbox.Button className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                        <span className="col-start-1 row-start-1 truncate pr-6">
                          {player}
                        </span>
                        <ChevronUpDownIcon
                          aria-hidden="true"
                          className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </Listbox.Button>

                      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none rounded-md">
                        {playerOptions
                          .filter(
                            (p) => p === "Escoge compañero" || p !== player
                          )
                          .map((playerOption, i) => (
                            <Listbox.Option
                              key={i}
                              value={playerOption}
                              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-black data-[focus]:text-white data-[focus]:outline-none"
                            >
                              <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                {playerOption}
                              </span>

                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                                <CheckIcon
                                  aria-hidden="true"
                                  className="size-5"
                                />
                              </span>
                            </Listbox.Option>
                          ))}
                      </Listbox.Options>
                    </Listbox>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Tournament modality selector */}
          <div className="mb-6">
            <label className="block text-sm/6 font-medium text-gray-900 mb-2">
              Modalidad del Torneo
            </label>
            <div className="relative mt-2">
              <Listbox
                value={tournamentModality}
                onChange={setTournamentModality}
              >
                <Listbox.Button className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pl-3 pr-2 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                  <span className="col-start-1 row-start-1 truncate pr-6">
                    {tournamentModality === "league"
                      ? "Liga (todos contra todos)"
                      : "Ganador se queda"}
                  </span>
                  <ChevronUpDownIcon
                    aria-hidden="true"
                    className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </Listbox.Button>

                <Listbox.Options className="absolute z-50 mt-1 w-full bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none rounded-md">
                  <Listbox.Option
                    value="winner-stays-on"
                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-black data-[focus]:text-white data-[focus]:outline-none"
                  >
                    {/* <span className="block truncate font-normal group-data-[selected]:font-semibold">
                      Ganador se queda
                    </span> */}
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                      <CheckIcon aria-hidden="true" className="size-5" />
                    </span>
                  </Listbox.Option>
                  <Listbox.Option
                    value="league"
                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-black data-[focus]:text-white data-[focus]:outline-none"
                  >
                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                      Liga (todos contra todos)
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                      <CheckIcon aria-hidden="true" className="size-5" />
                    </span>
                  </Listbox.Option>
                </Listbox.Options>
              </Listbox>
            </div>
          </div>

          {error && (
            <div className="w-full max-w-md mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <button
            onClick={handleStartTournament}
            disabled={isSubmitting}
            className="w-full mt-4 rounded-md flex items-center justify-center bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <TbPlayVolleyball className="inline-block w-4 h-4 mr-2 animate-spin" />
                Creando torneo...
              </>
            ) : (
              <>
                <GoTrophy className="inline-block w-4 h-4 mr-2" /> Comenzar
                Torneo
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p>Cargando equipos...</p>
        </div>
      )}
    </div>
  );
}

export default SortTeams;
