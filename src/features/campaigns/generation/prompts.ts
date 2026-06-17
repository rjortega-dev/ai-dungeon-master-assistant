import { CampaignPromptInput } from "./input-schemas";

export function campaignPrompt(input: CampaignPromptInput){
    const locations = input.worldSetting.locations?.map(
        (location) => `
        Name: ${location.name}
        LocationType: ${location.locationType}
        Description: ${location.description}

        Climate: ${location.climate}
        GovernmentType: ${location.governmentType}

        Status: ${location.status} (consider how status affects what scenes make sense here — e.g. a destroyed location shouldn't host a peaceful tavern scene)
        ${location.importance ? `Importance: ${location.importance}` : ""}
        ${location.secrets ? `Secrets (DM Only — weave into hidden transitions, not visible to players): ${location.secrets}` : ""}
        ${location.rumors ? `Rumors: ${location.rumors}` : ""}
    `)
.join("\n") ?? "";
    
    const storyBeats = input.storyBeats?.map(
        (beat) => `
        BeatTitle: ${beat.title}
        BeatStoryType: ${beat.storyBeatType}
        BeatTaskType: ${beat.beatTaskType}
        Notes: ${beat.notes}
        `
    ).join("\n") ?? "";

    const players = input.players?.map(
        (player) => `
        PlayerName: ${player.playerName}
        CharacterName: ${player.characterName}
        Class: ${player.characterClass}
        Level: ${player.characterLevel}
        Race: ${player.characterRace}
        Notes: ${player.notes}
        `).join("\n") ?? "";


    return `
    CampaignName: ${input.campaignName}
    WorldSetting: ${input.worldSetting.name}
    SettingStyle: ${input.worldSetting.settingStyle}
    CampaignCharacters: ${players}
    Locations: ${locations}
    StoryBeats: ${storyBeats}
    `
}

export const campaignInstructions = `
You are an expert tabletop RPG campaign designer.
Requirements:

- Create between 15 and 25 story beats.
- Each story beat must have a unique beatId.
- Every beat should have 2-4 possible transitions.
- Branches should reconnect periodically.
- Include at least:
  - one success path
  - one failure path
  - one secret path
- The campaign must be completable.
- Include at least one ending beat.
- Ending beats should have no outgoing transitions.

Generate valid JSON matching the provided schema.
`