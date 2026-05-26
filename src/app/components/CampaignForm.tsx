"use client";

import { useState } from "react";

import Button from "./Button";
import PlayerForm from "./PlayerForm";
import WorldForm from "./WorldForm";
import StoryBeatSection from "./StoryBeatSection";

import type { Player } from "../types/player"

export default function CampaignForm() {
  const [campaignName, setCampaignName] = useState("");
  const [setting, setSetting] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);

  function addPlayer() {
    setPlayers([
      ...players,
      {
        player_name: "",
        character_name: "",
        character_class: "",
        race: "",
        character_level: null,
        notes: "",
      },
    ]);
  }

  function updatePlayer(
    index: number,
    field: keyof Player,
    value: string | number | null
  ) {
    const updatedPlayers = [...players];

    updatedPlayers[index] = {
      ...updatedPlayers[index],
      [field]: value,
    };

    setPlayers(updatedPlayers)
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    // Placeholder
    console.log({
      campaignName,
      setting,
    });

    alert("Campaign created (placeholder)");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg"
    >
      <div className="space-y-6 border p-6 rounded">
        <label className="block mb-1 font-medium">
          Campaign Name
        </label>

        <input
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          placeholder="Campaign Name"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Setting
        </label>

        <textarea
          value={setting}
          onChange={(e) => setSetting(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          placeholder="Enter your setting description here"
        />
      </div>

      <Button
        type="button"
        onClick={addPlayer}
      >
        Add Player
      </Button>

      <div className="space-y-4">
        {players.map((player, index) => (
          <PlayerForm
            key={index}
            player={player}
            index={index}
            updatePlayer={updatePlayer}
          />
        ))}
      </div>

      <WorldForm />

      <StoryBeatSection />

      <Button type="submit">
        Create Campaign
      </Button>
    </form>
  )
}