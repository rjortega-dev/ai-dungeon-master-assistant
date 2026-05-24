"use client";

import { useState } from "react";
import Button from "./Button";

export default function CampaignForm() {
  const [campaignName, setCampaignName] = useState("");
  const [setting, setSetting] = useState("");

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
      <div>
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
      <Button type="submit">
        Create Campaign
      </Button>
    </form>
  )
}