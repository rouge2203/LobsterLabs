import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { TbPlayVolleyball } from "react-icons/tb";
import { GoTrophy } from "react-icons/go";
import { GiPodiumWinner, GiWhistle } from "react-icons/gi";
import { Dialog } from "@headlessui/react";
import {
  CheckIcon,
  TrophyIcon,
  BookOpenIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { MdSkipNext } from "react-icons/md";

// Create a simple beep generator function for fallback
const generateBeep = () => {
  // Try to create audio context
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    const audioCtx = new AudioContext();
    return () => {
      try {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = "sine";
        oscillator.frequency.value = 800; // higher pitch
        gainNode.gain.value = 0.5;

        oscillator.start();

        // Stop after short duration
        setTimeout(() => {
          oscillator.stop();
        }, 200);
      } catch (e) {
        console.error("WebAudio API error:", e);
      }
    };
  } catch (e) {
    console.error("AudioContext not supported:", e);
    return null;
  }
};

// Initialize beep function outside component
const beep = generateBeep();

// Create a soccer referee whistle sound generator
const generateWhistle = () => {
  // Try to create audio context
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    let audioCtx = null;
    let currentOscillators = [];
    let currentGain = null;
    let lfoNode = null;

    // Start whistle sound
    const startWhistle = () => {
      try {
        if (!audioCtx) {
          audioCtx = new AudioContext();
        }

        // Create oscillator
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Configure oscillator
        oscillator.type = "square"; // more whistle-like
        oscillator.frequency.setValueAtTime(1800, audioCtx.currentTime); // start high
        oscillator.frequency.exponentialRampToValueAtTime(
          900,
          audioCtx.currentTime + 0.2
        ); // go down smoothly

        // Configure gain
        gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.5,
          audioCtx.currentTime + 0.05
        );

        // Start sound
        oscillator.start();

        // Track current oscillator and gain for stopping
        currentOscillators.push(oscillator);
        currentGain = gainNode;

        return oscillator;
      } catch (e) {
        console.error("WebAudio API error:", e);
        return null;
      }
    };

    // Stop whistle sound
    const stopWhistle = () => {
      try {
        // Stop all oscillators
        if (currentOscillators.length > 0) {
          currentOscillators.forEach((osc) => {
            try {
              osc.stop();
            } catch (e) {
              // Ignore errors during stop
            }
          });
          currentOscillators = [];
        }

        // Disconnect gain node
        if (currentGain) {
          try {
            currentGain.gain.exponentialRampToValueAtTime(
              0.001,
              audioCtx.currentTime + 0.1
            );
            setTimeout(() => {
              try {
                currentGain.disconnect();
                currentGain = null;
              } catch (e) {
                // Ignore errors during disconnect
              }
            }, 200);
          } catch (e) {
            // Ignore errors during disconnect
          }
        }
      } catch (e) {
        console.error("Error stopping whistle:", e);
      }
    };

    return {
      start: startWhistle,
      stop: stopWhistle,
    };
  } catch (e) {
    console.error("AudioContext not supported:", e);
    return {
      start: () => {},
      stop: () => {},
    };
  }
};

// Initialize whistle functions outside component
const whistle = generateWhistle();

function TournamentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingMatch, setUpdatingMatch] = useState(false);
  const [endingTournament, setEndingTournament] = useState(false);
  const [scoreTeamA, setScoreTeamA] = useState("");
  const [scoreTeamB, setScoreTeamB] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
  const [skipMatchDialogOpen, setSkipMatchDialogOpen] = useState(false);
  const [matchToUpdate, setMatchToUpdate] = useState(null);
  const [winnerTeam, setWinnerTeam] = useState(null);
  const [teamStats, setTeamStats] = useState([]);
  const [teamDetailsDialogOpen, setTeamDetailsDialogOpen] = useState(false);
  const [selectedTeamStats, setSelectedTeamStats] = useState(null);
  const [selectedTeamMatches, setSelectedTeamMatches] = useState([]);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualTeamA, setManualTeamA] = useState("");
  const [manualTeamB, setManualTeamB] = useState("");
  const [manualScoreA, setManualScoreA] = useState("");
  const [manualScoreB, setManualScoreB] = useState("");

  // New state variables for League functionality
  const [pendingMatches, setPendingMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isCreatingNewRound, setIsCreatingNewRound] = useState(false);
  const [newRoundDialogOpen, setNewRoundDialogOpen] = useState(false);

  useEffect(() => {
    fetchTournamentData();
  }, [id]);

  // Add score increment handlers
  const incrementScoreTeamA = () => {
    const currentScore = parseInt(scoreTeamA) || 0;
    setScoreTeamA((currentScore + 1).toString());
  };

  const incrementScoreTeamB = () => {
    const currentScore = parseInt(scoreTeamB) || 0;
    setScoreTeamB((currentScore + 1).toString());
  };

  // Add score decrement handlers
  const decrementScoreTeamA = () => {
    const currentScore = parseInt(scoreTeamA) || 0;
    if (currentScore > 0) {
      setScoreTeamA((currentScore - 1).toString());
    }
  };

  const decrementScoreTeamB = () => {
    const currentScore = parseInt(scoreTeamB) || 0;
    if (currentScore > 0) {
      setScoreTeamB((currentScore - 1).toString());
    }
  };

  // Set up realtime subscriptions for live updates
  useEffect(() => {
    if (!id) return;

    // Function to fetch data without setting loading state
    const refreshDataSilently = async () => {
      try {
        // Fetch tournament details
        const { data: tournamentData, error: tournamentError } = await supabase
          .from("tournaments")
          .select("*, winner_team_id, tournament_mode")
          .eq("id", id)
          .single();

        if (tournamentError) throw tournamentError;

        // Fetch teams with player information
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select(
            `
            id,
            player1:player1_id(id, name),
            player2:player2_id(id, name)
          `
          )
          .eq("tournament_id", id);

        if (teamsError) throw teamsError;

        // Fetch matches
        const { data: matchesData, error: matchesError } = await supabase
          .from("matches")
          .select(
            `
            id,
            team_a:team_a_id(id, player1:player1_id(name), player2:player2_id(name)),
            team_b:team_b_id(id, player1:player1_id(name), player2:player2_id(name)),
            winner_team_id,
            score_team_a,
            score_team_b,
            match_order,
            played_at,
            team_a_id,
            team_b_id
          `
          )
          .eq("tournament_id", id)
          .order("match_order");

        if (matchesError) throw matchesError;

        // Calculate team statistics including win streaks
        const stats = calculateTeamStats(teamsData, matchesData);

        // If tournament has a winner, find the winner team
        let winnerTeamData = null;
        if (tournamentData.winner_team_id) {
          winnerTeamData = teamsData.find(
            (t) => t.id === tournamentData.winner_team_id
          );
        }

        // Update state only when all data is ready
        setTournament(tournamentData);
        setTeams(teamsData);
        setMatches(matchesData);
        if (winnerTeamData) setWinnerTeam(winnerTeamData);
        setTeamStats(stats);

        // Handle league mode specific data organization
        if (tournamentData.tournament_mode === "Liga") {
          // Separate matches into pending and completed
          const pending = matchesData.filter((match) => !match.played_at);
          const completed = matchesData.filter((match) => match.played_at);

          setPendingMatches(pending);
          setCompletedMatches(completed);
        }
      } catch (error) {
        console.error("Error refreshing tournament data:", error);
      }
    };

    // Subscribe to tournament changes
    const tournamentSubscription = supabase
      .channel("tournament-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tournaments",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          if (payload.new) {
            // Just update the tournament object directly, keep other data
            setTournament(payload.new);

            // If winner is set, update winner team
            if (payload.new.winner_team_id && teams.length > 0) {
              const winner = teams.find(
                (t) => t.id === payload.new.winner_team_id
              );
              if (winner) setWinnerTeam(winner);
            }
          }
        }
      )
      .subscribe();

    // Subscribe to matches changes
    const matchesSubscription = supabase
      .channel("matches-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `tournament_id=eq.${id}`,
        },
        () => {
          // Refresh all data silently without setting loading state
          refreshDataSilently();
        }
      )
      .subscribe();

    // Subscribe to teams changes
    const teamsSubscription = supabase
      .channel("teams-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
          filter: `tournament_id=eq.${id}`,
        },
        () => {
          // Refresh all data silently without setting loading state
          refreshDataSilently();
        }
      )
      .subscribe();

    // Clean up subscriptions when component unmounts
    return () => {
      tournamentSubscription.unsubscribe();
      matchesSubscription.unsubscribe();
      teamsSubscription.unsubscribe();
    };
  }, [id]);

  const fetchTournamentData = async () => {
    try {
      setIsLoading(true);

      // Fetch tournament details
      const { data: tournamentData, error: tournamentError } = await supabase
        .from("tournaments")
        .select("*, winner_team_id, tournament_mode")
        .eq("id", id)
        .single();

      if (tournamentError) throw tournamentError;

      // Fetch teams with player information
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select(
          `
          id,
          player1:player1_id(id, name),
          player2:player2_id(id, name)
        `
        )
        .eq("tournament_id", id);

      if (teamsError) throw teamsError;

      // Fetch matches
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select(
          `
          id,
          team_a:team_a_id(id, player1:player1_id(name), player2:player2_id(name)),
          team_b:team_b_id(id, player1:player1_id(name), player2:player2_id(name)),
          winner_team_id,
          score_team_a,
          score_team_b,
          match_order,
          played_at,
          team_a_id,
          team_b_id
        `
        )
        .eq("tournament_id", id)
        .order("match_order");

      if (matchesError) throw matchesError;

      // Calculate team statistics including win streaks
      const stats = calculateTeamStats(teamsData, matchesData);

      // If tournament has a winner, find the winner team
      let winnerTeamData = null;
      if (tournamentData.winner_team_id) {
        winnerTeamData = teamsData.find(
          (t) => t.id === tournamentData.winner_team_id
        );
      }

      // Set main state
      setTournament(tournamentData);
      setTeams(teamsData);
      setMatches(matchesData);
      setWinnerTeam(winnerTeamData);
      setTeamStats(stats);

      // Handle league mode specific data organization
      if (tournamentData.tournament_mode === "Liga") {
        // Separate matches into pending and completed
        const pending = matchesData.filter((match) => !match.played_at);
        const completed = matchesData.filter((match) => match.played_at);

        setPendingMatches(pending);
        setCompletedMatches(completed);
      }
    } catch (error) {
      console.error("Error fetching tournament data:", error);
      setError("Error loading tournament data.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTeamStats = (teamsData, matchesData) => {
    // Create a map to store team stats
    const statsMap = new Map();

    // Initialize stats for each team
    teamsData.forEach((team) => {
      statsMap.set(team.id, {
        team,
        wins: 0,
        losses: 0,
        matchesPlayed: 0,
        goalsScored: 0,
        goalsConceded: 0,
        consecutiveWins: 0,
        maxConsecutiveWins: 0,
        lastMatchOrder: 0,
        lastResult: null, // 'win' or 'loss'
      });
    });

    // Sort matches by match_order to process them chronologically
    const sortedMatches = [...matchesData].sort(
      (a, b) => (a.match_order || 0) - (b.match_order || 0)
    );

    // Process each match to update stats
    sortedMatches.forEach((match) => {
      // Skip matches that haven't been played or have special scores (like skipped)
      if (!match.winner_team_id || match.score_team_a === 999) return;

      // Get team IDs and scores
      const teamAId = match.team_a_id;
      const teamBId = match.team_b_id;
      const scoreA = match.score_team_a || 0;
      const scoreB = match.score_team_b || 0;

      // Update stats for Team A
      if (statsMap.has(teamAId)) {
        const statsA = statsMap.get(teamAId);
        statsA.matchesPlayed += 1;
        statsA.goalsScored += scoreA;
        statsA.goalsConceded += scoreB;

        if (match.winner_team_id === teamAId) {
          statsA.wins += 1;
          statsA.consecutiveWins =
            statsA.lastResult === "win" ? statsA.consecutiveWins + 1 : 1;
          statsA.lastResult = "win";
        } else {
          statsA.losses += 1;
          statsA.consecutiveWins = 0;
          statsA.lastResult = "loss";
        }
        // Update max streak if current streak is higher
        if (statsA.consecutiveWins > statsA.maxConsecutiveWins) {
          statsA.maxConsecutiveWins = statsA.consecutiveWins;
        }
        statsA.lastMatchOrder = match.match_order;
        statsMap.set(teamAId, statsA);
      }

      // Update stats for Team B
      if (statsMap.has(teamBId)) {
        const statsB = statsMap.get(teamBId);
        statsB.matchesPlayed += 1;
        statsB.goalsScored += scoreB;
        statsB.goalsConceded += scoreA;

        if (match.winner_team_id === teamBId) {
          statsB.wins += 1;
          statsB.consecutiveWins =
            statsB.lastResult === "win" ? statsB.consecutiveWins + 1 : 1;
          statsB.lastResult = "win";
        } else {
          statsB.losses += 1;
          statsB.consecutiveWins = 0;
          statsB.lastResult = "loss";
        }
        // Update max streak if current streak is higher
        if (statsB.consecutiveWins > statsB.maxConsecutiveWins) {
          statsB.maxConsecutiveWins = statsB.consecutiveWins;
        }
        statsB.lastMatchOrder = match.match_order;
        statsMap.set(teamBId, statsB);
      }
    });

    // Convert map to array and sort by wins (descending), then goal difference
    const statsArray = Array.from(statsMap.values());
    statsArray.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      const goalDiffA = a.goalsScored - a.goalsConceded;
      const goalDiffB = b.goalsScored - b.goalsConceded;
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
      return a.losses - b.losses; // Fewer losses is better if goal difference is same
    });

    return statsArray;
  };

  const getNextMatch = () => {
    // Next match is the latest match created without a winner yet
    return matches.find(
      (match) => !match.winner_team_id && match.team_a_id && match.team_b_id
    );
  };

  const getOnDeckTeam = () => {
    // If tournament has a winner or no matches exist, no team is on deck
    if (tournament?.winner_team_id || matches.length === 0) return null;

    // Get the next match that's ready to play
    const currentMatch = getNextMatch();
    if (!currentMatch) return null;

    // Get IDs of teams currently playing
    const currentlyPlayingTeamIds = [
      currentMatch.team_a_id,
      currentMatch.team_b_id,
    ];

    // If no matches have been played yet (tournament just created)
    const playedMatches = matches.filter((m) => m.played_at);
    if (playedMatches.length === 0) {
      if (teams.length > 2) {
        // When tournament is first created, the next team in queue should be team at index 2
        return teams[2]; // Return the third team (index 2) in the original teams array
      }
      return null; // Not enough teams for an on-deck team
    }

    // For all other cases, we need to simulate the exact selection logic used in setMatchWinner

    // Get all completed matches in chronological order (oldest first, to match setMatchWinner)
    const completedMatches = matches
      .filter((m) => m.played_at)
      .sort((a, b) => new Date(a.played_at) - new Date(b.played_at));

    // Build a historically accurate queue of losers in the order they lost
    const loserQueue = [];
    const playedTeamIds = new Set();
    const winnerIds = new Set();

    // Record all teams that have played and all winners
    completedMatches.forEach((match) => {
      playedTeamIds.add(match.team_a_id);
      playedTeamIds.add(match.team_b_id);
      winnerIds.add(match.winner_team_id);

      // Add the loser to the loser queue
      const loserId =
        match.winner_team_id === match.team_a_id
          ? match.team_b_id
          : match.team_a_id;

      // If this loser is already in the queue, remove it first (they lost again)
      const existingIndex = loserQueue.indexOf(loserId);
      if (existingIndex !== -1) {
        loserQueue.splice(existingIndex, 1);
      }

      // Add the loser to the back of the queue
      loserQueue.push(loserId);
    });

    // Get the current winner (expected to be team_a in the next match)
    const currentWinnerId =
      completedMatches[completedMatches.length - 1].winner_team_id;

    // Find teams that haven't played yet
    const neverPlayedTeams = teams.filter(
      (team) =>
        !playedTeamIds.has(team.id) &&
        !currentlyPlayingTeamIds.includes(team.id)
    );

    // If there are teams that haven't played yet, they come first
    if (neverPlayedTeams.length > 0) {
      return neverPlayedTeams[0];
    }

    // Filter out the current winner and currently playing teams from the loser queue
    const availableLoserIds = loserQueue.filter(
      (id) => id !== currentWinnerId && !currentlyPlayingTeamIds.includes(id)
    );

    // The next team to play is the first loser in the available queue
    if (availableLoserIds.length > 0) {
      const nextTeamId = availableLoserIds[0];
      return teams.find((team) => team.id === nextTeamId) || null;
    }

    return null;
  };

  const getUpcomingMatches = () => {
    // If tournament has a winner, there are no upcoming matches
    if (tournament?.winner_team_id) return [];

    // Find the next match that's ready to play
    const nextReadyMatchIndex = matches.findIndex(
      (match) => !match.winner_team_id && match.team_a_id && match.team_b_id
    );

    // If no ready match exists, get pending matches
    if (nextReadyMatchIndex === -1) {
      // Return all pending matches
      return matches.filter((match) => !match.winner_team_id);
    }

    // Get all upcoming matches excluding the next immediate ready match
    return matches
      .slice(nextReadyMatchIndex + 1)
      .filter((match) => !match.winner_team_id);
  };

  const getRecentCompletedMatches = () => {
    // Get all completed matches, sorted by most recent first
    return matches
      .filter((m) => m.winner_team_id)
      .sort((a, b) => new Date(b.played_at) - new Date(a.played_at))
      .slice(0, 5); // Only take the last 5 matches
  };

  const handleScoreSubmit = (match) => {
    // Parse scores as integers
    const scoreA = parseInt(scoreTeamA) || 0;
    const scoreB = parseInt(scoreTeamB) || 0;

    // Validation
    if (scoreA === scoreB) {
      alert(
        "El marcador no puede ser un empate. Por favor ajuste el resultado."
      );
      return;
    }

    if (scoreA < 0 || scoreB < 0) {
      alert("Los puntajes no pueden ser negativos.");
      return;
    }

    // Determine winner
    const winnerTeamId = scoreA > scoreB ? match.team_a_id : match.team_b_id;

    // Set match to update
    setMatchToUpdate({
      id: match.id,
      winnerTeamId,
      scoreA,
      scoreB,
      team_a_id: match.team_a_id,
      team_b_id: match.team_b_id,
      teamAName: getTeamName(match.team_a),
      teamBName: getTeamName(match.team_b),
      winnerName:
        scoreA > scoreB ? getTeamName(match.team_a) : getTeamName(match.team_b),
    });

    // Open confirmation dialog
    setConfirmDialogOpen(true);
  };

  // Handle opening the skip match dialog
  const handleSkipMatchClick = (match) => {
    // Set the match to update with needed info
    setMatchToUpdate({
      id: match.id,
      team_a_id: match.team_a_id,
      team_b_id: match.team_b_id,
      teamAName: getTeamName(match.team_a),
      teamBName: getTeamName(match.team_b),
    });

    // Open the skip match dialog
    setSkipMatchDialogOpen(true);
  };

  // Handle confirming the skip match action
  const confirmSkipMatch = async () => {
    if (!matchToUpdate) return;

    try {
      setUpdatingMatch(true);

      // 1. Get tournament data to find the previous winner
      const { data: tournamentData, error: tournamentError } = await supabase
        .from("tournaments")
        .select("id, current_winner_team_id")
        .eq("id", id)
        .single();

      if (tournamentError) throw tournamentError;
      const currentWinnerId = tournamentData.current_winner_team_id;

      // 2. Determine team to put at the back of the queue (acts as the 'loser')
      const loserTeamId = // Treat the non-winner as the loser for queue logic
        matchToUpdate.team_a_id === currentWinnerId
          ? matchToUpdate.team_b_id
          : matchToUpdate.team_a_id;

      // 3. Delete the match being skipped
      const { error: deleteError } = await supabase
        .from("matches")
        .delete()
        .eq("id", matchToUpdate.id);

      if (deleteError) throw deleteError;

      // --- Now replicate the queue logic from setMatchWinner ---

      // 4. Get all teams for this tournament
      const { data: allTeamsData, error: teamsError } = await supabase
        .from("teams")
        .select("id")
        .eq("tournament_id", id);

      if (teamsError) throw teamsError;
      const allTeamIds = allTeamsData.map((t) => t.id);

      // 5. Get recent completed matches (excluding the one we just deleted)
      const { data: recentMatches, error: matchesError } = await supabase
        .from("matches")
        .select("team_a_id, team_b_id, winner_team_id, played_at")
        .eq("tournament_id", id)
        .not("played_at", "is", null) // Only completed matches
        .order("played_at", { ascending: false }); // Most recent first

      if (matchesError) throw matchesError;

      // 6. Apply setMatchWinner queue logic:

      // Get all available teams (excluding the current winner)
      const availableTeamIds = allTeamIds.filter(
        (teamId) => teamId !== currentWinnerId
      );

      // Get teams that have already played, ordered from most to least recent
      const playedTeams = recentMatches.flatMap((m) => [
        m.team_a_id,
        m.team_b_id,
      ]);
      const playedTeamsUnique = [...new Set(playedTeams)];

      // Remove the current winner from this list
      const recentlyPlayedOpponents = playedTeamsUnique.filter(
        (id) => id !== currentWinnerId
      );

      // Reorganize availableTeams to prioritize:
      // 1. Teams that haven't played yet
      // 2. Teams that played least recently
      // 3. Always put the loser (teamToQueue) at the back

      // First, remove the loser from available teams
      const teamsWithoutLoser = availableTeamIds.filter(
        (id) => id !== loserTeamId
      );

      // Sort teams by how recently they played (never played teams come first)
      const sortedTeamIds = [
        // Teams that haven't played (or played long ago)
        ...teamsWithoutLoser.filter(
          (id) => !recentlyPlayedOpponents.includes(id)
        ),
        // Teams that played recently, sorted by least recent first
        ...teamsWithoutLoser
          .filter((id) => recentlyPlayedOpponents.includes(id))
          .sort((a, b) => {
            // Lower index in recentlyPlayedOpponents means played more recently
            // We want higher index (played less recently) first
            return (
              recentlyPlayedOpponents.indexOf(a) -
              recentlyPlayedOpponents.indexOf(b)
            );
          }),
      ];

      // Add loser back at the end
      // Only add if they are actually an available team (not the current winner)
      if (availableTeamIds.includes(loserTeamId)) {
        sortedTeamIds.push(loserTeamId);
      }

      // Get next opponent
      const nextOpponent = sortedTeamIds.length > 0 ? sortedTeamIds[0] : null;

      // 7. Create the new match
      if (nextOpponent) {
        // Use the count of matches BEFORE deletion + 1 for the new match order
        const nextMatchOrder = (recentMatches?.length || 0) + 1;
        await supabase.from("matches").insert({
          team_a_id: currentWinnerId,
          team_b_id: nextOpponent,
          tournament_id: id,
          match_order: nextMatchOrder,
        });
      }

      // 8. Close dialog and refresh data
      setSkipMatchDialogOpen(false);
      setMatchToUpdate(null);
      await fetchTournamentData(); // Fetch fresh data after updates
    } catch (error) {
      console.error("Error skipping match:", error);
      setError("Error al saltar el partido.");
    } finally {
      setUpdatingMatch(false);
    }
  };

  // Handle click on a team row in the leaderboard
  const handleTeamRowClick = (stat) => {
    const teamId = stat.team.id;

    // Filter matches for the selected team
    const teamMatches = matches
      .filter(
        (match) =>
          (match.team_a_id === teamId || match.team_b_id === teamId) &&
          match.played_at // Only include played matches
      )
      .sort((a, b) => new Date(b.played_at) - new Date(a.played_at)); // Sort recent first

    // Calculate form guide (last 5 matches: W/L)
    const formGuide = teamMatches
      .slice(0, 5) // Take the last 5
      .map((match) => (match.winner_team_id === teamId ? "V" : "D")) // V for Victoria, D for Derrota
      .reverse(); // Reverse to show oldest first (left-to-right)

    setSelectedTeamStats(stat);
    setSelectedTeamMatches(teamMatches);
    setTeamDetailsDialogOpen(true);
  };

  const getTeamName = (team) => {
    if (!team) return "Equipo desconocido";
    if (!team.player1) return "Equipo desconocido";

    const player1Name = team.player1.name;
    const player2Name = team.player2?.name || "";

    return player2Name ? `${player1Name} y ${player2Name}` : player1Name;
  };

  const setMatchWinner = async () => {
    if (!matchToUpdate) return;

    try {
      setUpdatingMatch(true);

      // Update the current match
      const { error: updateError } = await supabase
        .from("matches")
        .update({
          winner_team_id: matchToUpdate.winnerTeamId,
          score_team_a: matchToUpdate.scoreA,
          score_team_b: matchToUpdate.scoreB,
          played_at: new Date().toISOString(),
        })
        .eq("id", matchToUpdate.id);

      if (updateError) throw updateError;

      // Get tournament data
      const { data: tournamentData, error: tournamentError } = await supabase
        .from("tournaments")
        .select("id, current_winner_team_id, current_streak")
        .eq("id", id)
        .single();

      if (tournamentError) throw tournamentError;

      let current_winner_team_id = matchToUpdate.winnerTeamId;
      let current_streak = 1;

      // If the same team keeps winning, increment streak
      if (
        tournamentData.current_winner_team_id === matchToUpdate.winnerTeamId
      ) {
        current_streak = tournamentData.current_streak + 1;
      }

      // Update tournament with new current winner and streak
      await supabase
        .from("tournaments")
        .update({
          current_winner_team_id,
          current_streak,
        })
        .eq("id", id);

      // Get all teams for this tournament to form the queue
      const { data: allTeams, error: teamsError } = await supabase
        .from("teams")
        .select("id")
        .eq("tournament_id", id);

      if (teamsError) throw teamsError;

      // Get recent matches to determine the queue order
      const { data: recentMatches, error: matchesError } = await supabase
        .from("matches")
        .select("team_a_id, team_b_id, winner_team_id, played_at")
        .eq("tournament_id", id)
        .order("played_at", { ascending: false });

      if (matchesError) throw matchesError;

      // Determine loser of current match
      const loserTeamId =
        matchToUpdate.winnerTeamId === matchToUpdate.team_a_id
          ? matchToUpdate.team_b_id
          : matchToUpdate.team_a_id;

      // Get all available teams (excluding the current winner)
      const availableTeams = teams
        .filter((team) => team.id !== matchToUpdate.winnerTeamId)
        .map((team) => team.id);

      // Get teams that have already played, ordered from most to least recent
      const playedTeams = matches
        .filter((m) => m.played_at)
        .sort((a, b) => new Date(b.played_at) - new Date(a.played_at))
        .flatMap((m) => [m.team_a_id, m.team_b_id]);

      // Remove duplicates to get order of most recently played
      const playedTeamsUnique = [...new Set(playedTeams)];

      // Remove the current winner from this list
      const recentlyPlayedOpponents = playedTeamsUnique.filter(
        (id) => id !== matchToUpdate.winnerTeamId
      );

      // Reorganize availableTeams to prioritize:
      // 1. Teams that haven't played yet
      // 2. Teams that played least recently
      // 3. Always put the loser at the back

      // First, remove the loser from available teams
      const teamsWithoutLoser = availableTeams.filter(
        (id) => id !== loserTeamId
      );

      // Sort teams by how recently they played (never played teams come first)
      const sortedTeams = [
        ...teamsWithoutLoser.filter(
          (id) => !recentlyPlayedOpponents.includes(id)
        ),
        ...teamsWithoutLoser
          .filter((id) => recentlyPlayedOpponents.includes(id))
          .sort((a, b) => {
            return (
              recentlyPlayedOpponents.indexOf(b) -
              recentlyPlayedOpponents.indexOf(a)
            );
          }),
      ];

      // Add loser back at the end
      sortedTeams.push(loserTeamId);

      // Get next opponent
      const nextOpponent = sortedTeams.length > 0 ? sortedTeams[0] : null;

      if (nextOpponent) {
        // Create next match with current winner as team_a and next team in queue as team_b
        await supabase.from("matches").insert({
          team_a_id: current_winner_team_id,
          team_b_id: nextOpponent,
          tournament_id: id,
          match_order: recentMatches.length + 1,
        });
      }

      // Reset and close dialog
      setScoreTeamA("");
      setScoreTeamB("");
      setConfirmDialogOpen(false);
      setMatchToUpdate(null);

      await fetchTournamentData();
    } catch (error) {
      console.error("Error updating match:", error);
      setError("Error updating match result.");
    } finally {
      setUpdatingMatch(false);
    }
  };

  const handleFinishTournament = () => {
    // Get the team with most wins to suggest as winner
    if (teamStats.length > 0) {
      setWinnerTeam(teamStats[0].team); // First team has most wins due to sorting
      setFinishDialogOpen(true);
    } else {
      setError("No hay equipos registrados en el torneo.");
    }
  };

  const confirmFinishTournament = async () => {
    if (!winnerTeam) return;

    try {
      setEndingTournament(true);

      // Update tournament with winner
      const { error: updateError } = await supabase
        .from("tournaments")
        .update({
          winner_team_id: winnerTeam.id,
          ended_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // Close dialog and refresh data
      setFinishDialogOpen(false);
      await fetchTournamentData();
    } catch (error) {
      console.error("Error ending tournament:", error);
      setError("Error al finalizar el torneo.");
    } finally {
      setEndingTournament(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleManualSubmit = async () => {
    // Validate inputs
    if (!manualTeamA || !manualTeamB) {
      alert("Por favor seleccione ambos equipos.");
      return;
    }

    if (manualTeamA === manualTeamB) {
      alert("Por favor seleccione dos equipos diferentes.");
      return;
    }

    const scoreA = parseInt(manualScoreA) || 0;
    const scoreB = parseInt(manualScoreB) || 0;

    if (scoreA === scoreB) {
      alert(
        "El marcador no puede ser un empate. Por favor ajuste el resultado."
      );
      return;
    }

    if (scoreA < 0 || scoreB < 0) {
      alert("Los puntajes no pueden ser negativos.");
      return;
    }

    try {
      setUpdatingMatch(true);

      // Determine winner
      const winnerTeamId = scoreA > scoreB ? manualTeamA : manualTeamB;

      // Create a new match directly with the result
      const { data: newMatch, error: createError } = await supabase
        .from("matches")
        .insert({
          tournament_id: id,
          team_a_id: manualTeamA,
          team_b_id: manualTeamB,
          score_team_a: scoreA,
          score_team_b: scoreB,
          winner_team_id: winnerTeamId,
          played_at: new Date().toISOString(),
          match_order: matches.length + 1,
        })
        .select();

      if (createError) throw createError;

      // Reset form
      setManualTeamA("");
      setManualTeamB("");
      setManualScoreA("");
      setManualScoreB("");

      // Update current winner in tournament
      await supabase
        .from("tournaments")
        .update({
          current_winner_team_id: winnerTeamId,
        })
        .eq("id", id);

      // Refresh data
      await fetchTournamentData();
    } catch (error) {
      console.error("Error creating manual match:", error);
      setError("Error al registrar el partido manual.");
    } finally {
      setUpdatingMatch(false);
    }
  };

  const startWhistle = () => {
    if (whistle) {
      whistle.start();
    } else {
      // Fallback to MP3 (though this won't support hold-to-play)
      try {
        const audio = new Audio("/whistle.mp3");
        audio.play().catch((error) => {
          console.error("Error playing whistle sound:", error);
        });
      } catch (error) {
        console.error("Failed to initialize or play whistle sound:", error);
      }
    }
  };

  const stopWhistle = () => {
    if (whistle) {
      whistle.stop();
    }
  };

  // Handle selecting a match to update
  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setScoreTeamA(""); // Reset scores
    setScoreTeamB("");
    setMatchDialogOpen(true);
  };

  // Update a league match with scores
  const updateLeagueMatch = async () => {
    if (!selectedMatch) return;

    try {
      setUpdatingMatch(true);

      // Parse scores as integers
      const scoreA = parseInt(scoreTeamA) || 0;
      const scoreB = parseInt(scoreTeamB) || 0;

      // Validation
      if (scoreA === scoreB) {
        alert(
          "El marcador no puede ser un empate. Por favor ajuste el resultado."
        );
        setUpdatingMatch(false);
        return;
      }

      if (scoreA < 0 || scoreB < 0) {
        alert("Los puntajes no pueden ser negativos.");
        setUpdatingMatch(false);
        return;
      }

      // Determine winner
      const winnerTeamId =
        scoreA > scoreB ? selectedMatch.team_a_id : selectedMatch.team_b_id;

      // Update the match
      const { error: updateError } = await supabase
        .from("matches")
        .update({
          winner_team_id: winnerTeamId,
          score_team_a: scoreA,
          score_team_b: scoreB,
          played_at: new Date().toISOString(),
        })
        .eq("id", selectedMatch.id);

      if (updateError) throw updateError;

      // Reset state
      setScoreTeamA("");
      setScoreTeamB("");
      setMatchDialogOpen(false);
      setSelectedMatch(null);

      // Refresh data
      await fetchTournamentData();
    } catch (error) {
      console.error("Error updating match:", error);
      setError("Error al actualizar el partido.");
    } finally {
      setUpdatingMatch(false);
    }
  };

  // These variables were moved down after the loading/error checks
  // const nextMatch = getNextMatch();
  // const upcomingMatches = getUpcomingMatches();
  // const isTournamentActive = !tournament.winner_team_id;
  // const isLeagueMode = tournament.tournament_mode === "Liga";

  // League UI render function
  const renderLeagueUI = () => {
    return (
      <>
        {/* Tournament Controls */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-start sm:items-center gap-4">
          <button
            onClick={handleFinishTournament}
            className="rounded-md bg-amber-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 w-full sm:w-auto"
          >
            Finalizar Torneo
          </button>

          <button
            onClick={() => setNewRoundDialogOpen(true)}
            className="rounded-md bg-black px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 w-full sm:w-auto"
          >
            Crear nueva ronda
          </button>

          {/* Mode Toggle */}
          <div className="flex items-center space-x-2 justify-center sm:justify-end">
            <span
              className={`text-sm ${
                !isManualMode ? "font-bold" : "text-gray-500"
              }`}
            >
              Partidos programados
            </span>
            <button
              onClick={() => setIsManualMode(!isManualMode)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                isManualMode ? "bg-black" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isManualMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${
                isManualMode ? "font-bold" : "text-gray-500"
              }`}
            >
              Registro Manual
            </span>
          </div>
        </div>

        {!isManualMode ? (
          <>
            {/* Teams Leaderboard - Moved above the pending matches */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Clasificación</h3>
              <div className="overflow-hidden bg-white shadow sm:rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                        Equipo
                      </th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                        Victorias
                      </th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                        Partidos
                      </th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 whitespace-nowrap">
                        % Victoria
                      </th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                        P+
                      </th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                        P-
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teamStats.map((stat) => (
                      <tr
                        key={stat.team.id}
                        onClick={() => handleTeamRowClick(stat)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="py-4 pl-4 pr-3">
                          <div className="font-medium flex items-center">
                            {stat.team.player1.name}
                            {stat.consecutiveWins >= 2 && (
                              <span className="ml-2 inline-flex items-center">
                                <span className="text-orange-500">🔥</span>
                                <span className="text-xs ml-1">
                                  {stat.consecutiveWins}
                                </span>
                              </span>
                            )}
                          </div>
                          <div className="font-medium">
                            {stat.team.player2?.name || ""}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-center">{stat.wins}</td>
                        <td className="px-3 py-4 text-center">
                          {stat.matchesPlayed}
                        </td>
                        <td className="px-3 py-4 text-center whitespace-nowrap">
                          {stat.matchesPlayed > 0
                            ? `${Math.round(
                                (stat.wins / stat.matchesPlayed) * 100
                              )}%`
                            : "-"}
                        </td>
                        <td className="px-3 py-4 text-center">
                          {stat.goalsScored}
                        </td>
                        <td className="px-3 py-4 text-center">
                          {stat.goalsConceded}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Matches */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Partidos Pendientes</h3>
                <button
                  onMouseDown={startWhistle}
                  onMouseUp={stopWhistle}
                  onMouseLeave={stopWhistle}
                  onTouchStart={startWhistle}
                  onTouchEnd={stopWhistle}
                  className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 active:bg-yellow-300"
                  title="Sonar silbato (mantener presionado)"
                >
                  <GiWhistle className="w-5 h-5" />
                </button>
              </div>
              {pendingMatches.length > 0 ? (
                <div className="space-y-4">
                  {pendingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm border cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectMatch(match)}
                    >
                      <div className="grid grid-cols-3 gap-4 items-center text-center">
                        <div>
                          <p className="font-semibold">
                            {match.team_a.player1.name}
                          </p>
                          <p className="font-semibold">
                            {match.team_a.player2?.name || ""}
                          </p>
                        </div>
                        <div className="text-xl font-bold">VS</div>
                        <div>
                          <p className="font-semibold">
                            {match.team_b.player1.name}
                          </p>
                          <p className="font-semibold">
                            {match.team_b.player2?.name || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center p-4 bg-gray-50 rounded-lg border">
                  No hay partidos pendientes. Puede crear una nueva ronda o
                  agregar partidos manualmente.
                </p>
              )}
            </div>

            {/* Completed Matches */}
            {completedMatches.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Partidos Completados
                </h3>
                <div className="space-y-4">
                  {completedMatches.map((match) => {
                    const winnerIsTeamA =
                      match.winner_team_id === match.team_a_id;
                    return (
                      <div
                        key={match.id}
                        className="bg-gray-50 p-4 rounded-md shadow-sm border"
                      >
                        <div className="grid grid-cols-5 gap-2 items-center text-center">
                          <div
                            className={`col-span-2 ${
                              winnerIsTeamA ? "font-bold" : ""
                            }`}
                          >
                            <p className="text-sm">
                              {match.team_a.player1.name}
                            </p>
                            <p className="text-sm">
                              {match.team_a.player2?.name || ""}
                            </p>
                          </div>
                          <div className="text-sm">
                            {match.score_team_a} - {match.score_team_b}
                          </div>
                          <div
                            className={`col-span-2 ${
                              !winnerIsTeamA ? "font-bold" : ""
                            }`}
                          >
                            <p className="text-sm">
                              {match.team_b.player1.name}
                            </p>
                            <p className="text-sm">
                              {match.team_b.player2?.name || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          // Manual Mode UI - unchanged
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                Registro Manual de Partido
              </h3>
              <button
                onMouseDown={startWhistle}
                onMouseUp={stopWhistle}
                onMouseLeave={stopWhistle}
                onTouchStart={startWhistle}
                onTouchEnd={stopWhistle}
                className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 active:bg-yellow-300"
                title="Sonar silbato (mantener presionado)"
              >
                <GiWhistle className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
              <div className="grid grid-cols-5 gap-4 items-center">
                {/* Team A Selection */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipo 1
                  </label>
                  <div className="grid grid-cols-1">
                    <select
                      value={manualTeamA}
                      onChange={(e) => setManualTeamA(e.target.value)}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                    >
                      <option value="">Seleccionar equipo</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {getTeamName(team)}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold">VS</div>
                </div>

                {/* Team B Selection */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipo 2
                  </label>
                  <div className="grid grid-cols-1">
                    <select
                      value={manualTeamB}
                      onChange={(e) => setManualTeamB(e.target.value)}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                    >
                      <option value="">Seleccionar equipo</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {getTeamName(team)}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </div>
                </div>
              </div>

              {/* Score inputs */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-center font-medium mb-3">Resultado</h4>
                <div className="grid grid-cols-5 gap-2 items-center">
                  <div className="col-span-2 flex">
                    <button
                      onClick={() => {
                        const current = parseInt(manualScoreA) || 0;
                        if (current > 0)
                          setManualScoreA((current - 1).toString());
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-l-md border border-r-0"
                      type="button"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={manualScoreA}
                      onChange={(e) => setManualScoreA(e.target.value)}
                      className="w-full p-2 border text-center"
                      placeholder="0"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <button
                      onClick={() => {
                        const current = parseInt(manualScoreA) || 0;
                        setManualScoreA((current + 1).toString());
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-r-md border border-l-0"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-center text-sm">-</div>
                  <div className="col-span-2 flex">
                    <button
                      onClick={() => {
                        const current = parseInt(manualScoreB) || 0;
                        if (current > 0)
                          setManualScoreB((current - 1).toString());
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-l-md border border-r-0"
                      type="button"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={manualScoreB}
                      onChange={(e) => setManualScoreB(e.target.value)}
                      className="w-full p-2 border text-center"
                      placeholder="0"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <button
                      onClick={() => {
                        const current = parseInt(manualScoreB) || 0;
                        setManualScoreB((current + 1).toString());
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-r-md border border-l-0"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={handleManualSubmit}
                    disabled={updatingMatch}
                    className="w-full py-2 px-4 bg-black hover:bg-gray-800 text-white rounded-md disabled:bg-gray-400"
                  >
                    {updatingMatch ? "Guardando..." : "Registrar Partido"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Function to create a new round of league matches
  const createNewLeagueRound = async () => {
    try {
      setIsCreatingNewRound(true);

      // Get the current highest match order
      const maxOrder = matches.reduce(
        (max, match) => (match.match_order > max ? match.match_order : max),
        0
      );

      let matchOrder = maxOrder + 1;
      const newMatches = [];

      // Generate matches for all teams against each other
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          newMatches.push({
            tournament_id: id,
            team_a_id: teams[i].id,
            team_b_id: teams[j].id,
            match_order: matchOrder++,
          });
        }
      }

      // Insert new matches
      if (newMatches.length > 0) {
        const { error: matchesError } = await supabase
          .from("matches")
          .insert(newMatches);

        if (matchesError) throw matchesError;
      }

      // Close dialog and refresh data
      setNewRoundDialogOpen(false);
      await fetchTournamentData();
    } catch (error) {
      console.error("Error creating new round:", error);
      setError("Error al crear nueva ronda de partidos.");
    } finally {
      setIsCreatingNewRound(false);
    }
  };

  // Add a function to sort the pendingMatches before displaying them
  useEffect(() => {
    // Sort pending matches when they change
    if (pendingMatches.length > 1) {
      const sortedMatches = sortMatchesForRest([...pendingMatches]);
      setPendingMatches(sortedMatches);
    }
  }, [matches]); // Only re-sort when all matches change

  // Function to sort matches so teams can rest between games
  const sortMatchesForRest = (matches) => {
    if (matches.length <= 1) return matches;

    // Create a map to track how many times each team appears in pending matches
    const teamOccurrences = new Map();

    // Count team occurrences in pending matches
    matches.forEach((match) => {
      const teamAId = match.team_a_id;
      const teamBId = match.team_b_id;

      teamOccurrences.set(teamAId, (teamOccurrences.get(teamAId) || 0) + 1);
      teamOccurrences.set(teamBId, (teamOccurrences.get(teamBId) || 0) + 1);
    });

    // Track which teams have already played in our sorted list
    const recentlyPlayed = new Set();

    // Resulting sorted array
    const result = [];

    // First match - teams with fewest total occurrences
    let bestMatch = matches[0];
    let bestScore = Number.MAX_SAFE_INTEGER;

    matches.forEach((match) => {
      const score =
        teamOccurrences.get(match.team_a_id) +
        teamOccurrences.get(match.team_b_id);
      if (score < bestScore) {
        bestScore = score;
        bestMatch = match;
      }
    });

    // Add first match to result
    result.push(bestMatch);

    // Mark teams as recently played
    recentlyPlayed.add(bestMatch.team_a_id);
    recentlyPlayed.add(bestMatch.team_b_id);

    // Remove this match from available matches
    const remainingMatches = matches.filter((m) => m.id !== bestMatch.id);

    // Keep adding matches until we've used them all
    while (remainingMatches.length > 0) {
      // For each potential next match, calculate a score based on:
      // 1. Whether its teams just played (avoid back-to-back games)
      // 2. How many total games these teams have
      const matchScores = remainingMatches.map((match) => {
        const teamAId = match.team_a_id;
        const teamBId = match.team_b_id;

        // Add a large penalty if a team just played
        const recentlyPlayedPenalty =
          (recentlyPlayed.has(teamAId) ? 100 : 0) +
          (recentlyPlayed.has(teamBId) ? 100 : 0);

        // Add a smaller score based on how many total games these teams have
        const occurenceScore =
          teamOccurrences.get(teamAId) + teamOccurrences.get(teamBId);

        return {
          match,
          score: recentlyPlayedPenalty + occurenceScore,
        };
      });

      // Sort matches by score (lowest first = best)
      matchScores.sort((a, b) => a.score - b.score);

      // Pick the best match
      const nextBest = matchScores[0].match;

      // Add it to results
      result.push(nextBest);

      // Update recently played teams
      // First, clear the recently played set if all teams have played
      if (recentlyPlayed.size >= teamOccurrences.size) {
        recentlyPlayed.clear();
      }

      // Add the teams from this match
      recentlyPlayed.add(nextBest.team_a_id);
      recentlyPlayed.add(nextBest.team_b_id);

      // Remove from remaining
      const idx = remainingMatches.findIndex((m) => m.id === nextBest.id);
      remainingMatches.splice(idx, 1);
    }

    return result;
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen p-8 flex flex-col items-center justify-center">
        <TbPlayVolleyball className="w-12 h-12 animate-spin" />
        <p className="mt-4">Cargando datos del torneo...</p>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="bg-white min-h-screen p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md p-4 bg-red-100 text-red-700 rounded-md">
          {error || "Torneo no encontrado"}
        </div>
        <button
          onClick={() => navigate("/spikeball/tournaments")}
          className="mt-4 rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        >
          Volver a Torneos
        </button>
      </div>
    );
  }

  // Now we can safely use tournament since we've checked it's not null
  const nextMatch = getNextMatch();
  const upcomingMatches = getUpcomingMatches();
  const isTournamentActive = !tournament.winner_team_id;
  const isLeagueMode = tournament.tournament_mode === "Liga";

  return (
    <div className="bg-white min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold flex items-center  gap-2">SpikeBall</h1>

      <div className="w-full max-w-3xl mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold items-center gap-2 flex">
              {tournament.name}
              <GoTrophy className="text-2xl text-amber-500" />
            </h2>
            <p className="text-gray-600">{formatDate(tournament.date)}</p>
            {tournament.winner_team_id && winnerTeam && (
              <div className="mt-2 flex items-center">
                <span className="text-sm font-medium text-gray-600 mr-2">
                  Ganador del torneo:
                </span>
                <span className="text-sm font-bold text-amber-600">
                  {getTeamName(winnerTeam)}{" "}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setRulesDialogOpen(true)}
              className="mr-4 p-2 rounded-full bg-gray-100"
              title="Reglas del Torneo"
            >
              <BookOpenIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {isTournamentActive &&
          (isLeagueMode ? (
            renderLeagueUI()
          ) : (
            <>
              {/* Winner Stays On Mode UI (existing code) */}
              <div className="mb-8  flex flex-col sm:flex-row sm:justify-start sm:items-center gap-4">
                <button
                  onClick={handleFinishTournament}
                  className="rounded-md bg-amber-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 w-full sm:w-auto"
                >
                  Finalizar Torneo
                </button>

                {/* Mode Toggle */}
                <div className="flex items-center space-x-2 justify-center sm:justify-end">
                  <span
                    className={`text-sm ${
                      !isManualMode ? "font-bold" : "text-gray-500"
                    }`}
                  >
                    Modo Torneo
                  </span>
                  <button
                    onClick={() => setIsManualMode(!isManualMode)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                      isManualMode ? "bg-black" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isManualMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm ${
                      isManualMode ? "font-bold" : "text-gray-500"
                    }`}
                  >
                    Registro Manual
                  </span>
                </div>
              </div>

              {!isManualMode ? (
                <>
                  {/* Next Match Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Próximo Partido</h3>
                      <button
                        onMouseDown={startWhistle}
                        onMouseUp={stopWhistle}
                        onMouseLeave={stopWhistle}
                        onTouchStart={startWhistle}
                        onTouchEnd={stopWhistle}
                        className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 active:bg-yellow-300"
                        title="Sonar silbato (mantener presionado)"
                      >
                        <GiWhistle className="w-5 h-5" />
                      </button>
                    </div>
                    {nextMatch ? (
                      <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
                        <div className="grid grid-cols-3 gap-4 items-center text-center">
                          <div>
                            {nextMatch.team_a ? (
                              <>
                                <p className="font-semibold">
                                  {nextMatch.team_a.player1.name}
                                </p>
                                <p className="font-semibold">
                                  {nextMatch.team_a.player2?.name || ""}
                                </p>
                              </>
                            ) : (
                              <p className="italic text-gray-500">
                                Ganador partido anterior
                              </p>
                            )}
                          </div>
                          <div className="text-xl font-bold">VS</div>
                          <div>
                            {nextMatch.team_b ? (
                              <>
                                <p className="font-semibold">
                                  {nextMatch.team_b.player1.name}
                                </p>
                                <p className="font-semibold">
                                  {nextMatch.team_b.player2?.name || ""}
                                </p>
                              </>
                            ) : (
                              <p className="italic text-gray-500">
                                Por determinar
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Match result input - only show when both teams are assigned */}
                        {nextMatch.team_a && nextMatch.team_b ? (
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <h4 className="text-center font-medium mb-3">
                              Registrar resultado
                            </h4>
                            <div className="grid grid-cols-5 gap-2 items-center">
                              <div className="col-span-2 flex">
                                <button
                                  onClick={decrementScoreTeamA}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-l-md border border-r-0"
                                  type="button"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={scoreTeamA}
                                  onChange={(e) =>
                                    setScoreTeamA(e.target.value)
                                  }
                                  className="w-full p-2 border text-center"
                                  placeholder="0"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                />
                                <button
                                  onClick={incrementScoreTeamA}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-r-md border border-l-0"
                                  type="button"
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-center text-sm">-</div>
                              <div className="col-span-2 flex">
                                <button
                                  onClick={decrementScoreTeamB}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-l-md border border-r-0"
                                  type="button"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={scoreTeamB}
                                  onChange={(e) =>
                                    setScoreTeamB(e.target.value)
                                  }
                                  className="w-full p-2 border text-center"
                                  placeholder="0"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                />
                                <button
                                  onClick={incrementScoreTeamB}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-r-md border border-l-0"
                                  type="button"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="mt-4">
                              <button
                                onClick={() => handleScoreSubmit(nextMatch)}
                                disabled={updatingMatch}
                                className="w-full py-2 px-4 bg-black hover:bg-gray-800 text-white rounded-md disabled:bg-gray-400"
                              >
                                {updatingMatch
                                  ? "Guardando..."
                                  : "Registrar marcador"}
                              </button>

                              <button
                                onClick={() => handleSkipMatchClick(nextMatch)}
                                disabled={updatingMatch}
                                className="ml-auto mt-2 flex items-center justify-end py-2 px-4 hover:bg-gray-300 text-gray-700 rounded-md disabled:bg-gray-100 disabled:text-gray-400"
                              >
                                <MdSkipNext className="text-xl" /> Saltar
                                Partido
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-gray-500 italic">
                            <p>
                              Este partido está pendiente de asignación de
                              equipos
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-center p-4 bg-gray-50 rounded-lg border">
                        No hay partidos pendientes
                      </p>
                    )}
                  </div>

                  {/* On Deck Team Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Equipo En Espera
                    </h3>
                    {nextMatch && getOnDeckTeam() ? (
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-2">
                            Este equipo jugará contra el ganador del próximo
                            partido
                          </div>
                          <div className="font-medium">
                            <p>{getOnDeckTeam().player1.name} </p>
                            <p>{getOnDeckTeam().player2?.name || ""}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center p-4 bg-gray-50 rounded-lg border text-gray-500 italic">
                        {matches.filter((m) => !m.winner_team_id).length > 1
                          ? "Buscando próximo equipo..."
                          : "No hay equipos en espera"}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                // Manual Mode UI - unchanged
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">
                      Registro Manual de Partido
                    </h3>
                    <button
                      onMouseDown={startWhistle}
                      onMouseUp={stopWhistle}
                      onMouseLeave={stopWhistle}
                      onTouchStart={startWhistle}
                      onTouchEnd={stopWhistle}
                      className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 active:bg-yellow-300"
                      title="Sonar silbato (mantener presionado)"
                    >
                      <GiWhistle className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Rest of manual mode UI remains unchanged */}
                </div>
              )}
            </>
          ))}

        {/* Teams Leaderboard - only show for winner-stays-on mode as league mode has its own */}
        {(!isLeagueMode || !isTournamentActive) && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Clasificación</h3>
            <div className="overflow-hidden bg-white shadow sm:rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Equipo
                    </th>
                    <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Victorias
                    </th>
                    <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Partidos
                    </th>
                    <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 whitespace-nowrap">
                      % Victoria
                    </th>
                    <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      P+
                    </th>
                    <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      P-
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teamStats.map((stat) => (
                    <tr
                      key={stat.team.id}
                      onClick={() => handleTeamRowClick(stat)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-4 pl-4 pr-3">
                        <div className="font-medium flex items-center">
                          {stat.team.player1.name}
                          {stat.consecutiveWins >= 2 && (
                            <span className="ml-2 inline-flex items-center">
                              <span className="text-orange-500">🔥</span>
                              <span className="text-xs ml-1">
                                {stat.consecutiveWins}
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="font-medium">
                          {stat.team.player2?.name || ""}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">{stat.wins}</td>
                      <td className="px-3 py-4 text-center">
                        {stat.matchesPlayed}
                      </td>
                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        {stat.matchesPlayed > 0
                          ? `${Math.round(
                              (stat.wins / stat.matchesPlayed) * 100
                            )}%`
                          : "-"}
                      </td>
                      <td className="px-3 py-4 text-center">
                        {stat.goalsScored}
                      </td>
                      <td className="px-3 py-4 text-center">
                        {stat.goalsConceded}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Completed Matches - for winner stays on mode only */}
        {!isLeagueMode && getRecentCompletedMatches().length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Últimos Partidos</h3>
            <div className="space-y-4">
              {getRecentCompletedMatches().map((match) => {
                const winnerIsTeamA = match.winner_team_id === match.team_a_id;
                return (
                  <div
                    key={match.id}
                    className="bg-gray-50 p-4 rounded-md shadow-sm border"
                  >
                    <div className="grid grid-cols-5 gap-2 items-center text-center">
                      <div
                        className={`col-span-2 ${
                          winnerIsTeamA ? "font-bold" : ""
                        }`}
                      >
                        <p className="text-sm">{match.team_a.player1.name}</p>
                        <p className="text-sm">
                          {match.team_a.player2?.name || ""}
                        </p>
                      </div>
                      <div className="text-sm">
                        {match.score_team_a} - {match.score_team_b}
                      </div>
                      <div
                        className={`col-span-2 ${
                          !winnerIsTeamA ? "font-bold" : ""
                        }`}
                      >
                        <p className="text-sm">{match.team_b.player1.name}</p>
                        <p className="text-sm">
                          {match.team_b.player2?.name || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ... existing dialogs ... */}

      {/* League Match Dialog */}
      <Dialog
        open={matchDialogOpen}
        onClose={() => setMatchDialogOpen(false)}
        className="relative z-10"
      >
        <Dialog.Backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
              {selectedMatch && (
                <>
                  <div>
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-yellow-100">
                      <TbPlayVolleyball className="size-6 text-yellow-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold text-gray-900"
                      >
                        Registrar resultado
                      </Dialog.Title>
                      <div className="mt-2">
                        <div className="grid grid-cols-3 gap-4 items-center text-center">
                          <div>
                            <p className="font-semibold">
                              {selectedMatch.team_a.player1.name}
                            </p>
                            <p className="font-semibold">
                              {selectedMatch.team_a.player2?.name || ""}
                            </p>
                          </div>
                          <div className="text-xl font-bold">VS</div>
                          <div>
                            <p className="font-semibold">
                              {selectedMatch.team_b.player1.name}
                            </p>
                            <p className="font-semibold">
                              {selectedMatch.team_b.player2?.name || ""}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <div className="col-span-2 flex">
                              <button
                                onClick={decrementScoreTeamA}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-l-md border border-r-0"
                                type="button"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={scoreTeamA}
                                onChange={(e) => setScoreTeamA(e.target.value)}
                                className="w-full p-2 border text-center"
                                placeholder="0"
                                inputMode="numeric"
                                pattern="[0-9]*"
                              />
                              <button
                                onClick={incrementScoreTeamA}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-r-md border border-l-0"
                                type="button"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-center text-sm">-</div>
                            <div className="col-span-2 flex">
                              <button
                                onClick={decrementScoreTeamB}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-l-md border border-r-0"
                                type="button"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={scoreTeamB}
                                onChange={(e) => setScoreTeamB(e.target.value)}
                                className="w-full p-2 border text-center"
                                placeholder="0"
                                inputMode="numeric"
                                pattern="[0-9]*"
                              />
                              <button
                                onClick={incrementScoreTeamB}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 rounded-r-md border border-l-0"
                                type="button"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={updateLeagueMatch}
                      disabled={updatingMatch}
                      className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:bg-gray-400"
                    >
                      {updatingMatch ? "Guardando..." : "Registrar resultado"}
                    </button>
                    <button
                      type="button"
                      data-autofocus
                      onClick={() => setMatchDialogOpen(false)}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      {/* New Round Dialog */}
      <Dialog
        open={newRoundDialogOpen}
        onClose={() => setNewRoundDialogOpen(false)}
        className="relative z-10"
      >
        <Dialog.Backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-yellow-100">
                  <TbPlayVolleyball className="size-6 text-yellow-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    Crear nueva ronda
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      ¿Está seguro que desea crear una nueva ronda de partidos?
                      Se crearán partidos para que todos los equipos jueguen
                      entre sí.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={createNewLeagueRound}
                  disabled={isCreatingNewRound}
                  className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:bg-gray-400"
                >
                  {isCreatingNewRound ? "Creando..." : "Crear ronda"}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setNewRoundDialogOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                  Cancelar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      {/* Rules Dialog */}
      <Dialog
        open={rulesDialogOpen}
        onClose={() => setRulesDialogOpen(false)}
        className="relative z-10"
      >
        <Dialog.Backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                    Reglas del Torneo
                  </Dialog.Title>
                  <div className="mt-4 text-left">
                    <div className="text-sm text-gray-500 space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Formato del Torneo
                      </h4>
                      {isLeagueMode ? (
                        <>
                          <p>Este torneo utiliza un formato de liga, donde:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Todos los equipos juegan contra todos los demás
                              equipos.
                            </li>
                            <li>
                              Cada partido ganado suma una victoria al registro
                              del equipo.
                            </li>
                            <li>
                              Se pueden crear nuevas rondas para que los equipos
                              jueguen múltiples veces entre sí.
                            </li>
                            <li>
                              El ganador es el equipo con más victorias al
                              finalizar el torneo.
                            </li>
                            <li>
                              En caso de empate, se considera el diferencial de
                              puntos.
                            </li>
                          </ul>
                          <h4 className="font-medium text-gray-900 mt-4">
                            Sistema de puntuación
                          </h4>
                          <p>
                            El equipo con más victorias al final del torneo será
                            declarado ganador. En caso de empate en victorias,
                            se considerará el diferencial de puntos (puntos a
                            favor menos puntos en contra).
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            Este torneo utiliza un formato de cola continua,
                            donde:
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
                              Se muestran estadísticas en tiempo real de
                              victorias y partidos jugados.
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
                            Los equipos con rachas de 2 o más victorias
                            consecutivas se muestran con un indicador de fuego
                            (🔥).
                          </p>
                          <h4 className="font-medium text-gray-900 mt-4">
                            Sistema de puntuación
                          </h4>
                          <p>
                            El ganador del torneo será el equipo con más
                            victorias o en caso de empate, el equipo con mejor %
                            de victorias.
                          </p>
                        </>
                      )}
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
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      {/* Skip Match Dialog */}
      <Dialog
        open={skipMatchDialogOpen}
        onClose={() => setSkipMatchDialogOpen(false)}
        className="relative z-10"
      >
        <Dialog.Backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-yellow-100">
                  <MdSkipNext className="size-6 text-yellow-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    Saltar partido
                  </Dialog.Title>
                  <div className="mt-2">
                    {matchToUpdate && (
                      <div className="text-sm text-gray-500">
                        <p className="mb-2">
                          ¿Está seguro que desea saltar este partido?
                        </p>
                        <p className="font-medium mb-2">
                          {matchToUpdate.teamAName} vs {matchToUpdate.teamBName}
                        </p>
                        <p className="text-xs mb-2">
                          Este partido será eliminado sin declarar un ganador.
                        </p>
                        <p className="text-xs mb-2">
                          El ganador del partido anterior continuará jugando y
                          el otro equipo será el siguiente en la cola.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={confirmSkipMatch}
                  disabled={updatingMatch}
                  className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:bg-gray-400"
                >
                  {updatingMatch ? "Procesando..." : "Saltar partido"}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setSkipMatchDialogOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                  Cancelar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      {/* Team Details Dialog */}
      <Dialog
        open={teamDetailsDialogOpen}
        onClose={() => setTeamDetailsDialogOpen(false)}
        className="relative z-10"
      >
        <Dialog.Backdrop className="fixed w-screen inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center p-0 text-center sm:items-center sm:p-4">
            {/* Panel adjusted for full screen on mobile, standard on larger screens */}
            <Dialog.Panel className="flex h-full w-full flex-col overflow-hidden bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:h-auto sm:max-w-lg sm:rounded-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
              {selectedTeamStats && (
                <>
                  {/* Dialog Header */}
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold text-gray-900"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-full bg-yellow-100">
                            <TbPlayVolleyball className="w-5 h-5 text-yellow-600" />
                          </div>
                          {getTeamName(selectedTeamStats.team)}
                        </div>
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setTeamDetailsDialogOpen(false)}
                          className="relative rounded-md bg-gray-50 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dialog Content */}
                  <div className="flex-1 overflow-y-auto px-4 py-5 sm:p-6">
                    <div className="mt-3 text-center sm:mt-0">
                      <div className="mt-4">
                        {/* Best Streak */}
                        <div className="mb-4 text-center">
                          <p className="text-sm font-medium text-gray-700">
                            Mejor Racha:
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {selectedTeamStats.maxConsecutiveWins || 0}
                          </p>
                        </div>
                        {/* Form Guide */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Forma (Últimos 5):
                          </p>
                          <div className="flex justify-center space-x-1">
                            {selectedTeamMatches.length > 0 ? (
                              selectedTeamMatches
                                .slice(0, 5)
                                .map((match) =>
                                  match.winner_team_id ===
                                  selectedTeamStats.team.id
                                    ? "V"
                                    : "D"
                                )
                                .reverse() // Show oldest first
                                .map((result, index) => (
                                  <span
                                    key={index}
                                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                      result === "V"
                                        ? "bg-green-200 text-green-800"
                                        : "bg-red-200 text-red-800"
                                    }`}
                                  >
                                    {result}
                                  </span>
                                ))
                            ) : (
                              <span className="text-sm text-gray-500 italic">
                                No hay partidos jugados
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Match List Table */}
                        <div className="mt-6">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Partidos Jugados:
                          </p>
                          {selectedTeamMatches.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Oponente
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Marcador
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Resultado
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {selectedTeamMatches.map((match) => {
                                    const isTeamA =
                                      match.team_a_id ===
                                      selectedTeamStats.team.id;
                                    const opponentTeam = isTeamA
                                      ? match.team_b
                                      : match.team_a;
                                    const opponentName =
                                      getTeamName(opponentTeam);
                                    const score = isTeamA
                                      ? `${match.score_team_a} - ${match.score_team_b}`
                                      : `${match.score_team_b} - ${match.score_team_a}`;
                                    const result =
                                      match.winner_team_id ===
                                      selectedTeamStats.team.id
                                        ? "Ganado"
                                        : "Perdido";
                                    const resultColor =
                                      result === "Ganado"
                                        ? "text-green-600"
                                        : "text-red-600";
                                    return (
                                      <tr key={match.id}>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                          vs {opponentName}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-center">
                                          {score}
                                        </td>
                                        <td
                                          className={`px-3 py-2 whitespace-nowrap text-sm font-semibold text-center ${resultColor}`}
                                        >
                                          {result}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic text-center">
                              No hay partidos jugados
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Dialog Footer */}
                  <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => setTeamDetailsDialogOpen(false)}
                      className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                    >
                      Cerrar
                    </button>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      {/* Finish Tournament Dialog */}
      <Dialog
        open={finishDialogOpen}
        onClose={() => setFinishDialogOpen(false)}
        className="relative z-10"
      >
        <Dialog.Backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100">
                  <TrophyIcon
                    aria-hidden="true"
                    className="size-6 text-amber-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    Finalizar torneo
                  </Dialog.Title>
                  <div className="mt-2">
                    {winnerTeam ? (
                      <div className="text-sm text-gray-500">
                        <p className="mb-2">
                          ¿Está seguro que desea finalizar el torneo?
                        </p>
                        <p className="mt-3">
                          El ganador será:{" "}
                          <span className="font-semibold">
                            {getTeamName(winnerTeam)}
                          </span>{" "}
                          con{" "}
                          {teamStats.find((s) => s.team.id === winnerTeam.id)
                            ?.wins || 0}{" "}
                          victorias.
                        </p>
                        <p className="mt-2 text-xs">
                          Una vez finalizado, no se podrán agregar más partidos.
                        </p>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        <p className="mb-4">
                          Seleccione el equipo ganador del torneo:
                        </p>
                        <div className="mb-4 max-h-60 overflow-y-auto px-1">
                          {teamStats.map((stat) => (
                            <div
                              key={stat.team.id}
                              onClick={() => setWinnerTeam(stat.team)}
                              className={`mb-2 p-3 rounded-md cursor-pointer transition-colors ${
                                winnerTeam?.id === stat.team.id
                                  ? "bg-amber-100 border border-amber-300"
                                  : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                              }`}
                            >
                              <div className="font-medium">
                                {getTeamName(stat.team)}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Victorias: {stat.wins} | Partidos:{" "}
                                {stat.matchesPlayed}
                                {stat.matchesPlayed > 0
                                  ? ` | % Victoria: ${Math.round(
                                      (stat.wins / stat.matchesPlayed) * 100
                                    )}%`
                                  : ""}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs">
                          Una vez finalizado, no se podrán agregar más partidos.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={confirmFinishTournament}
                  disabled={endingTournament || !winnerTeam}
                  className="inline-flex w-full justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:col-start-2 disabled:bg-gray-400"
                >
                  {endingTournament ? "Finalizando..." : "Finalizar torneo"}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => {
                    setFinishDialogOpen(false);
                    setWinnerTeam(null);
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                  Cancelar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default TournamentPage;
