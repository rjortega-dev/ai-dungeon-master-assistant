"use client";

import { useState } from "react";

import Button from "./Button";
import PlayerSection from "./PlayerSection";
import WorldForm from "./WorldForm";
import StoryBeatSection from "./StoryBeatSection";

import type { Campaign } from "../types/campaign"

export default function CampaignForm() {
    const [campaignData, setCampaignData] = useState<Campaign>({
    campaignName: "",

    players: [],

    world: {
      settingName: "",
      settingStyle: "",
      locations: [],
    },

    storyBeats: [],
  });

    function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    // Placeholder
    console.log(campaignData);

    alert(
      "Campaign created! (placeholder)"
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >

      <input
        value={campaignData.campaignName}
        onChange={(e) => 
          setCampaignData({
            ...campaignData,
            campaignName:
              e.target.value
            })
          }
          className="border px-3 py-2 rounded w-full"
          placeholder="Campaign Name"
      />

      <PlayerSection
        players={campaignData.players}
        setPlayers={(players) =>
          setCampaignData({
            ...campaignData,
            players,
          })
        }
      />

      <WorldForm 
        world={campaignData.world}
        setWorld={(world) =>
          setCampaignData({
            ...campaignData,
            world,
          })
        }
      />

      <StoryBeatSection 
        storyBeats={
          campaignData.storyBeats
        }
        setStoryBeats={(
          storyBeats
        ) =>
          setCampaignData({
            ...campaignData,
            storyBeats,
          })
        }
      />

      <Button type="submit">
        Create Campaign
      </Button>
    </form>
  )
}