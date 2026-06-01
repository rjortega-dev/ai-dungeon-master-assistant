import { updateCampaign, UpdateCampaignInput } from "@/features/campaigns/api/update-campaign";

export default async function updateCampaignAction(id: string, data: UpdateCampaignInput) {
    const updated = await updateCampaign(id, data)
    return updated
}