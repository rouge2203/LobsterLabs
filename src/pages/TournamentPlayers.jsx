import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TournamentPlayers() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the tournament page
    navigate(`/spikeball/tournaments/${id}`);
  }, [id, navigate]);

  return (
    <div className="bg-white min-h-screen p-8 flex flex-col items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}

export default TournamentPlayers;
