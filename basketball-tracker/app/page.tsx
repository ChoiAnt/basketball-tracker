"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Player = {
  name: string;
  stats: Record<string, number>;
  subInTime: number | null;
  minutes: number;
};

type LogEntry = {
  player: string;
  stat: string;
  time: string;
};

export default function BasketballTracker() {
  const [players, setPlayers] = useState<Player[]>([
    { name: "Player 1", stats: {}, subInTime: null, minutes: 0 },
    { name: "Player 2", stats: {}, subInTime: null, minutes: 0 },
  ]);

  const [log, setLog] = useState<LogEntry[]>([]);

  const statTypes = [
    "FG Attempt",
    "FG Made",
    "3PT Attempt",
    "3PT Made",
    "FT Attempt",
    "FT Made",
    "Rebound",
    "Assist",
    "Steal",
    "Block",
    "Foul",
  ];

  const updateStat = (playerIndex: number, stat: string) => {
    const newPlayers = [...players];
    if (!newPlayers[playerIndex].stats[stat]) {
      newPlayers[playerIndex].stats[stat] = 0;
    }
    newPlayers[playerIndex].stats[stat] += 1;

    if (stat === "FG Made") {
      newPlayers[playerIndex].stats["FG Attempt"] =
        (newPlayers[playerIndex].stats["FG Attempt"] || 0) + 1;
      newPlayers[playerIndex].stats["Points"] =
        (newPlayers[playerIndex].stats["Points"] || 0) + 2;
    }

    if (stat === "3PT Made") {
      newPlayers[playerIndex].stats["3PT Attempt"] =
        (newPlayers[playerIndex].stats["3PT Attempt"] || 0) + 1;
      newPlayers[playerIndex].stats["Points"] =
        (newPlayers[playerIndex].stats["Points"] || 0) + 3;
    }

    if (stat === "FT Made") {
      newPlayers[playerIndex].stats["FT Attempt"] =
        (newPlayers[playerIndex].stats["FT Attempt"] || 0) + 1;
      newPlayers[playerIndex].stats["Points"] =
        (newPlayers[playerIndex].stats["Points"] || 0) + 1;
    }

    setPlayers(newPlayers);

    const timestamp = new Date().toLocaleTimeString();
    setLog([{ player: newPlayers[playerIndex].name, stat, time: timestamp }, ...log]);
  };

  const handleSubIn = (playerIndex: number) => {
    const newPlayers = [...players];
    if (!newPlayers[playerIndex].subInTime) {
      newPlayers[playerIndex].subInTime = Date.now();
      setPlayers(newPlayers);

      const timestamp = new Date().toLocaleTimeString();
      setLog([{ player: newPlayers[playerIndex].name, stat: "Sub In", time: timestamp }, ...log]);
    }
  };

  const handleSubOut = (playerIndex: number) => {
    const newPlayers = [...players];
    if (newPlayers[playerIndex].subInTime) {
      const minutesPlayed = (Date.now() - newPlayers[playerIndex].subInTime) / 60000;
      newPlayers[playerIndex].minutes += minutesPlayed;
      newPlayers[playerIndex].subInTime = null;
      setPlayers(newPlayers);

      const timestamp = new Date().toLocaleTimeString();
      setLog([{ player: newPlayers[playerIndex].name, stat: `Sub Out (+${minutesPlayed.toFixed(1)} min)`, time: timestamp }, ...log]);
    }
  };

  const addPlayer = () => {
    setPlayers([...players, { name: `Player ${players.length + 1}`, stats: {}, subInTime: null, minutes: 0 }]);
  };

  const removePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  return (
    <div className="min-h-screen bg-black-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1 md:col-span-2 flex gap-2 mb-4">
        <button
          onClick={addPlayer}
          className="px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700"
        >
          ➕ Add Player
        </button>
      </div>
      {players.map((player, i) => (
        <div key={i} className="bg-black shadow-xl rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 w-full">
              {player.subInTime && <span className="h-3 w-3 rounded-full bg-green-500 inline-block" />}
              <input
                type="text"
                value={player.name}
                onChange={(e) => {
                  const newPlayers = [...players];
                  newPlayers[i].name = e.target.value;
                  setPlayers(newPlayers);
                }}
                className="text-xl font-bold w-full border p-2 rounded"
              />
            </div>
            <button
              onClick={() => removePlayer(i)}
              className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              ✖
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleSubIn(i)}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-2xl shadow-md hover:bg-green-700"
            >
              Sub In
            </button>
            <button
              onClick={() => handleSubOut(i)}
              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-2xl shadow-md hover:bg-red-700"
            >
              Sub Out
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {statTypes.map((stat, idx) => (
              <motion.div whileTap={{ scale: 0.9 }} key={idx}>
                <button
                  className="w-full px-3 py-2 bg-black-200 rounded-2xl shadow-md hover:bg-blue-900"
                  onClick={() => updateStat(i, stat)}
                >
                  {stat}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-4">
            <h2 className="font-semibold">Stats:</h2>
            <ul className="text-sm">
              <li>
                FG: {player.stats["FG Made"] || 0}/{player.stats["FG Attempt"] || 0}
              </li>
              <li>
                3PT: {player.stats["3PT Made"] || 0}/{player.stats["3PT Attempt"] || 0}
              </li>
              <li>
                FT: {player.stats["FT Made"] || 0}/{player.stats["FT Attempt"] || 0}
              </li>
              <li>Points: {player.stats["Points"] || 0}</li>
              <li>Minutes: {player.minutes.toFixed(1)}</li>
              {Object.entries(player.stats)
                .filter(
                  ([stat]) =>
                    !["FG Made", "FG Attempt", "3PT Made", "3PT Attempt", "FT Made", "FT Attempt", "Points"].includes(stat)
                )
                .map(([stat, value]) => (
                  <li key={stat}>
                    {stat}: {value as number}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ))}

      <div className="col-span-1 md:col-span-2 bg-black shadow-md rounded-2xl p-4">
        <h2 className="font-bold text-lg mb-2">Event Log</h2>
        <ul className="text-sm space-y-1 h-64 overflow-y-auto">
          {log.map((entry, idx) => (
            <li key={idx}>
              ⏱ {entry.time} - <b>{entry.player}</b>: {entry.stat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
