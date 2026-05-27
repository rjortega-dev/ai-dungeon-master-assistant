import { getCampaignWorld } from "@/features/campaigns/api/get-active-campaign-world";

export default async function Campaign(id:string) {
   const campaign = await getCampaignWorld(id)
   return campaign
}