import { notFound } from "next/navigation";
import Campaign from "../_actions/get-campaign-action";
import { StoryBeatGraph } from "@/app/components/StoryBeatGraph";

type CampaignPageProps = {
  params: Promise<{
    campaignId: string;
  }>;
};

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { campaignId } = await params;
  const campaign = await Campaign(campaignId);

  if (!campaign) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto space-y-10">
      <section className="border-b border-accent/20 pb-6">
        <p className="text-accent text-xs font-mono tracking-widest uppercase mb-2">
          Campaign
        </p>
        <h1 className="text-4xl font-bold text-foreground mb-1">
          {campaign?.title}
        </h1>
        <p className="text-muted text-sm">ID: {campaign?.id}</p>
        {campaign?.settingSummary && (
          <p className="mt-3 text-foreground/80">{campaign?.settingSummary}</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent tracking-wide">
          Players
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {campaign?.players.map((player) => {
            const level = player.campaignCharacters.find(
              (cc) => cc.campaignId === campaign.id,
            )?.startingLevel;

            return (
              <div
                key={player.id}
                className="bg-card border border-accent/20 rounded-lg p-4 hover:border-accent/50 transition-colors"
              >
                <h3 className="font-bold text-foreground">{player.name}</h3>
                <p className="text-muted text-sm mt-1">
                  {player.class} · Level {level ?? "?"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent tracking-wide">
          Story Beats
        </h2>
        <div className="grid gap-3">
          {campaign?.storyBeats.map((beat) => (
            <div
              key={beat.id}
              className="bg-card border border-accent/20 rounded-lg p-4 hover:border-accent/50 transition-colors"
            >
              <h3 className="font-bold text-foreground mb-1">{beat.title}</h3>
              <p className="text-foreground/70 text-sm">{beat.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent tracking-wide">
          Story Beats
        </h2>
        <div className="grid gap-3">
          {campaign?.storyBeats.map((beat) => (
            <div
              key={beat.id}
              className="bg-card border border-accent/20 rounded-lg p-4 hover:border-accent/50 transition-colors"
            >
              <h3 className="font-bold text-foreground mb-1">{beat.title}</h3>
              <p className="text-foreground/70 text-sm">{beat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-accent tracking-wide">
          Story Beat Graph
        </h2>
        <StoryBeatGraph campaignId={campaignId} />
      </section>
    </main>
  );
}
