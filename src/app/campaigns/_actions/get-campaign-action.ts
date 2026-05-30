import { getCampaignWorld } from "@/features/campaigns/api/get-active-campaign-world";

export default function Campaign(id:string) {
   return getCampaignWorld(id);
}