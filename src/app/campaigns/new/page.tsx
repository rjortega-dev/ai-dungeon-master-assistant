import CampaignForm from "@/app/components/CampaignForm";

export default function NewCampaign() {
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-accent text-xs font-mono tracking-widest uppercase mb-2">
          Dungeon Master Assistant
        </p>
        <h1 className="text-3xl font-bold text-foreground">New Campaign</h1>
      </div>
      <div className="bg-card border border-accent/20 rounded-xl p-6">
        <CampaignForm />
      </div>
    </main>
  );
}
