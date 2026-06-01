import { notFound } from "next/navigation";

import Campaign from "../_actions/get-campaign-action";

type CampaignPageProps = {
  params: Promise<{
    campaignId: string;
  }>;
};


export default async function CampaignPage({
  params,
}: CampaignPageProps) {
  const { campaignId } =  await params;
  const campaign =  await Campaign(campaignId);

  if (!campaign) {
    notFound();
  }
  // Placeholder campaign data
 

  return (
    <main className="p-6 space-y-8">
      <section>
        <h1 className="text-4xl font-bold">
          {campaign?.title}
        </h1>

        <p className="text-gray-500">
          Campaign ID: {campaign?.id}
        </p>

        <p className="mt-2">
          Setting: {campaign?.settingSummary}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Players
        </h2>

        <div className="grid gap-4">
          {campaign?.players.map((player) => {
            const level =
              player.campaignCharacters.find(
                (cc) =>
                  cc.campaignId === campaign.id
              )?.startingLevel;
              
              return (
              <div
                key={player.id}
                className="border p-4 rounded"
              >
                <h3 className="font-bold">
                  {player.name}
                </h3>

                <p>
                  Class: {player.class}
                </p>

                <p>
                  Level: {level ?? "Unknown"}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Story Beats
        </h2>
        <div className="grid gap-4">
          {campaign?.storyBeats.map(
            (beat) => (
              <div
                key={beat.id}
                className="border p-4 rounded"
              >
                <h3 className="font-bold">
                  {beat.title}
                </h3>

                <p>{beat.description}</p>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}