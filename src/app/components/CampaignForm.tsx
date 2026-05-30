"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Button from "./Button";
import PlayerSection from "./PlayerSection";
import WorldForm from "./WorldForm";
import StoryBeatSection from "./StoryBeatSection";

import type { Campaign } from "../types/campaign"

export default function CampaignForm() {
    const router = useRouter();
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

  console.log("Submitting campaign:", campaignData);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Create campaign failed:", error);
        return;
      }

      const campaign = await res.json();

      router.push(`/campaigns${campaign.id}`);
    } catch (err) {
      console.error("Network error:", err);
    }

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