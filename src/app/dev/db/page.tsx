
import { getCampaign } from "@/features/campaigns/api/get-campaign";


export default async function CampaignPage() {
  
  const campaign = await getCampaign('d21c892c-cbc4-4409-97e2-4d62dcb87f1a');

  if (!campaign) {
    return <div>Campaign not found.</div>;
  }

  return (
    <main>
      <pre>
        {JSON.stringify(campaign, null, 2)}
      </pre>

    </main>
  );
}