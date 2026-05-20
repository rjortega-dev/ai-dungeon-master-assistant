"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./components/Button";

export default function Home() {
  const router = useRouter();
  const [campaignId, setCampaignId] = useState("");

  //placeholder until backend exists
  function goToCampaign(id: string) {
    if (!id) return;

    console.log("Navigating to campaign:", id);

    router.push(`/campaigns/${id}`);
  }



  return (
    <div>
      <main>
        <div className="flex items-center justify-center h-screen">
          <div className="rounded-lg border-2 border-black pt-40 pb-40 pl-10 pr-10 max-w-4xl">
            <h1 className="text-5xl text-center">
              Welcome!
                <br></br>
              I&apos;m Merlin, your Dungeon Master Assistant!
            </h1>
            <div className="justify-self-center">
              <Button onClick={() => router.push("/campaigns/new")}>
                Create Campaign
              </Button>
            </div>
            <div className="justify-self-center">
              <input
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                placeholder="Enter campaign ID"
                className="border px-3 py-2 rounded w-full max-w-sm"
              />
              <br></br>
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
