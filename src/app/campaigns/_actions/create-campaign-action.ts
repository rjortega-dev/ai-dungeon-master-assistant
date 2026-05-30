import { createCampaign, CreateCampaignInput } from "@/features/campaigns/api/create-campaign";

export default async function createCampaignAction(data: CreateCampaignInput) {
    const campaign = await createCampaign(data);
    return campaign
}