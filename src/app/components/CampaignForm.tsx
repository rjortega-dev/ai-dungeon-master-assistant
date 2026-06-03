"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import PlayerSection from "./PlayerSection";
import WorldForm from "./WorldForm";
import StoryBeatSection from "./StoryBeatSection";
import {
  CampaignPromptInput,
  CampaignPromptInputSchema,
} from "@/features/campaigns/generation/input-schemas";
import { GenerateCampaign } from "../campaigns/_actions/generate-campaign-action";

export default function CampaignForm() {
  const router = useRouter();
  const [campaignData, setCampaignData] = useState<CampaignPromptInput>(
    CampaignPromptInputSchema.parse({}),
  );

  async function handleSubmit(e: React.SubmitEvent) {
    console.log("Submitting campaign:", campaignData);
    e.preventDefault();

    const generatedCampaign = await GenerateCampaign(campaignData);
    console.log(generatedCampaign);

    const combinedData = { ...campaignData, ...generatedCampaign };
    console.log(combinedData);

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(combinedData),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Create campaign failed:", error);
        return;
      }

      const campaign = await res.json();
      router.push(`/campaigns/${campaign.id}`);
    } catch (err) {
      console.error("Network error:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input
        value={campaignData.campaignName}
        onChange={(e) =>
          setCampaignData({ ...campaignData, campaignName: e.target.value })
        }
        placeholder="Campaign Name"
        className="bg-background border border-accent/30 text-foreground placeholder:text-muted px-3 py-2 rounded-lg w-full focus:outline-none focus:border-accent transition-colors"
      />

      <PlayerSection
        players={campaignData.players}
        setPlayers={(players) => setCampaignData({ ...campaignData, players })}
      />

      <WorldForm
        world={campaignData.worldSetting}
        setWorld={(world) =>
          setCampaignData({
            ...campaignData,
            worldSetting: world,
          })
        }
      />

      <StoryBeatSection
        storyBeats={campaignData.storyBeats}
        setStoryBeats={(storyBeats) =>
          setCampaignData({ ...campaignData, storyBeats })
        }
      />

      <Button type="submit">Create Campaign</Button>
    </form>
  );
}
