import { deleteCampaign } from "@/features/campaigns/api/delete-campaign";

export default async function deleteCampaignAction(id: string) {
    const campaign = await deleteCampaign(id)
    return campaign
    
}