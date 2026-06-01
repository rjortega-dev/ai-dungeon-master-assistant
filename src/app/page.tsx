"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./components/Button";

export default function Home() {
  const router = useRouter();
  const [campaignId, setCampaignId] = useState("");

  function goToCampaign(id: string) {
    if (!id) return;
    router.push(`/campaigns/${id}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <main className="w-full max-w-md">
        <div className="rounded-xl border border-accent/40 bg-card py-14 px-10 shadow-2xl shadow-black/60 space-y-8">
          <div className="text-center space-y-3">
            <p className="text-accent text-xs font-mono tracking-widest uppercase">
              AI Dungeon Master
            </p>
            <h1 className="text-4xl font-bold text-foreground leading-snug">
              Welcome!
              <br />
              I&apos;m Merlin, your{" "}
              <span className="text-accent">Dungeon Master Assistant</span>
            </h1>
          </div>

          <div className="space-y-4">
            <Button onClick={() => router.push("/campaigns/new")}>
              Create Campaign
            </Button>

            <div className="space-y-2">
              <input
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                placeholder="Enter campaign ID"
                className="bg-background border border-accent/30 text-foreground placeholder:text-muted px-3 py-2 rounded-lg w-full focus:outline-none focus:border-accent transition-colors"
              />
              <Button onClick={() => goToCampaign(campaignId)}>
                Go to Campaign
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
