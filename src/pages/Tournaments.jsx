import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { TbPlayVolleyball } from "react-icons/tb";
import { GoTrophy } from "react-icons/go";

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("tournaments")
        .select(
          `
          id,
          name,
          date,
          winner_team_id,
          winner_team:teams!tournaments_winner_team_id_fkey(
            player1:player1_id(id, name),
            player2:player2_id(id, name)
          ),
          teams:teams!teams_tournament_id_fkey(count),
          matches:matches(count)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTournaments(data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setError("Error loading tournaments");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen p-8 flex flex-col items-center justify-center">
        <TbPlayVolleyball className="w-12 h-12 animate-spin" />
        <p className="mt-4">Cargando torneos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold">SpikeBall</h1>
      <h2 className="text-xl font-semibold mt-2 mb-8 flex items-center gap-2">
        <GoTrophy className="w-5 h-5" /> Torneos
      </h2>

      <div className="w-full max-w-3xl">
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <Link
          to="/spikeball/new-tournament"
          className="inline-block mb-6 rounded-md bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        >
          + Nuevo Torneo
        </Link>

        {tournaments.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border">
            <p className="text-gray-600">No hay torneos disponibles</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                to={`/spikeball/tournaments/${tournament.id}`}
                className={`block p-6 bg-white rounded-lg border ${
                  tournament.winner_team_id
                    ? "border-amber-200"
                    : "border-gray-200"
                } shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tournament.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(tournament.date)}
                    </p>
                    {tournament.winner_team_id && tournament.winner_team && (
                      <div className="mt-2 flex items-center">
                        <span className="text-xs font-medium text-gray-600 mr-1">
                          Ganador:
                        </span>
                        <span className="text-xs font-semibold text-amber-600">
                          {tournament.winner_team.player1?.name}
                          {tournament.winner_team.player2?.name &&
                            ` y ${tournament.winner_team.player2.name}`}
                        </span>
                        <GoTrophy className="ml-1 w-3 h-3 text-amber-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="font-medium">
                        {tournament.teams[0].count}
                      </span>
                      <span className="ml-1">equipos</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">
                        {tournament.matches[0].count}
                      </span>
                      <span className="ml-1">partidos</span>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          tournament.winner_team_id
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {tournament.winner_team_id ? "Finalizado" : "Activo"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tournaments;
