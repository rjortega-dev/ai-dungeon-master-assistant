import { getCampaignWorld } from "@/features/campaigns/api/get-active-campaign-world";

export default async function Campaign(id:string) {
   await id 
   const campaign = getCampaignWorld(id)
   return campaign
}