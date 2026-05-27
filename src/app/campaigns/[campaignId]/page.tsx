import Campaign from "../_actions/get-campaign-action";

type CampaignPageProps = {
  params: {
    campaignId: string;
  };
};


export default async function CampaignPage({
  params,
}: CampaignPageProps) {
  const { campaignId } = await params;
  const campaign =  await Campaign(campaignId)
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
          {campaign?.players.map(
            (player, index) => (
              <div
                key={index}
                className="border p-4 rounded"
              >
                <h3 className="font-bold">
                  {player.name}
                </h3>

                <p>
                  Class:{" "}
                  {player.class}
                </p>

                <p>
                  Level: {player.campaignCharacters[index].startingLevel}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Story Beats
        </h2>
        <div className="grid gap-4">
          {campaign?.storyBeats.map(
            (beat, index) => (
              <div
                key={index}
                className="border p-4 rounded"
              >
                <h3 className="font-bold">
                  {beat[index].title}
                </h3>

                <p>{beat[index].title}</p>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}