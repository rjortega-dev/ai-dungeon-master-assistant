type CampaignPageProps = {
  params: {
    campaignId: string;
  };
};


export default function CampaignPage({
  params,
}: CampaignPageProps) {
  const { campaignId } = params;

  // Placeholder campaign data
  const campaign = {
    id: campaignId,

    name: "Shadows of Eldoria",

    setting: "Dark Fantasy",

    players: [
      {
        name: "Kael",
        characterClass: "Rogue",
        level: 3,
      },

      {
        name: "Lyra",
        characterClass: "Wizard",
        level: 2,
      },
    ],

    storyBeats: [
      {
        title: "Meet the Tavern Keeper",
        type: "meet_character",
      },

      {
        title: "Explore the Forgotten Dungeon",
        type: "exploration",
      },
    ],
  };

  return (
    <main className="p-6 space-y-8">
      <section>
        <h1 className="text-4xl font-bold">
          {campaign.name}
        </h1>

        <p className="text-gray-500">
          Campaign ID: {campaign.id}
        </p>

        <p className="mt-2">
          Setting: {campaign.setting}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bolt">
          Players
        </h2>

        <div className="grid gap-4">
          {campaign.players.map(
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
                  {player.characterClass}
                </p>

                <p>
                  Level: {player.level}
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
          {campaign.storyBeats.map(
            (beat, index) => (
              <div
                key={index}
                className="border p-4 rounded"
              >
                <h3 className="font-bold">
                  {beat.title}
                </h3>

                <p>{beat.type}</p>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}