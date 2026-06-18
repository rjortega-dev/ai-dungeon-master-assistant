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

  const inputClass =
  "bg-background border border-accent/30 text-foreground placeholder:text-muted px-3 py-2 rounded-lg w-full focus:outline-none focus:border-accent transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h2 className="text-xl font-semibold text-accent-text">Campaign Information</h2>
      <input
        value={campaignData.campaignName}
        onChange={(e) =>
          setCampaignData({ ...campaignData, campaignName: e.target.value })
        }
        placeholder="Campaign Name"
        className={inputClass}      />

      <div className="space-y-4">
        <input 
          value={campaignData.edition ?? ""} 
          onChange={(e) => setCampaignData({...campaignData, edition: e.target.value,})}
          placeholder="Edition (e.g. 5e, Pathfinder 2e)"
          className={inputClass}
        />

      <label className="flex items-center gap-2 text-lg font-semibold text-accent-text">
        <input
          type="checkbox"
          checked={campaignData.isHomebrew ?? false}
          onChange={(e) => setCampaignData({...campaignData, isHomebrew: e.target.checked,})}
        />
        Homebrew Campaign
      </label>

        <select
          value={campaignData.genre ?? ""}
          onChange={(e) => setCampaignData({...campaignData, genre: e.target.value,})}
          className={inputClass}
        >
          <option value="">Select Genre</option>
          <option value="FANTASY">Fantasy</option>
          <option value="HORROR">Horror</option>
          <option value="SCI_FI">Sci-Fi</option>
          <option value="MYSTERY">Mystery</option>
          <option value="POLITICAL">Political</option>
          <option value="SURVIVAL">Survival</option>
          <option value="EXPLORATION">Exploration</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          value={campaignData.tone ?? ""}
          onChange={(e) => setCampaignData({...campaignData, tone: e.target.value,})}
          className={inputClass}
        >
          <option value="">Select Tone</option>
          <option value="SERIOUS">Serious</option>
          <option value="DARK">Dark</option>
          <option value="COMEDIC">Comedic</option>
          <option value="HEROIC">Heroic</option>
          <option value="GRIMDARK">Grimdark</option>
          <option value="INTRIGUE">Intrigue</option>
          <option value="OTHER">Other</option>
        </select>

      <div className="flex gap-2">
        <input
          type="number"
          value={campaignData.startingLevel ?? ""}
          onChange={(e) => setCampaignData({...campaignData, startingLevel: Number(e.target.value),})}
          placeholder="Starting Level"
          className={inputClass}
        />

        <input
          type="number"
          value={campaignData.endingLevel ?? ""}
          onChange={(e) => setCampaignData({...campaignData, endingLevel: Number(e.target.value),})}
          placeholder="Ending Level"
          className={inputClass}
        />
      </div>

      <textarea
        value={campaignData.primaryThemes ?? ""}
        onChange={(e) => setCampaignData({...campaignData, primaryThemes: e.target.value,
        })}
        placeholder="Primary Themes (coma-separated)"
        className={inputClass}
      />

      <textarea
        value={campaignData.inspiration ?? ""}
        onChange={(e) => setCampaignData({...campaignData, inspiration: e.target.value,})}
        placeholder="Campaign inspiration (one sentence)"
        className={inputClass}
      />

      <textarea
        value={campaignData.centralConflict ?? ""}
        onChange={(e) => setCampaignData({...campaignData, centralConflict: e.target.value,})}
        placeholder="Central conflict"
        className={inputClass}
      />

      <textarea
        value={campaignData.ultimateGoal ?? ""}
        onChange={(e) => setCampaignData({...campaignData, ultimateGoal: e.target.value,})}
        placeholder="Ultimate goal"
        className={inputClass}
      />
    </div>

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
