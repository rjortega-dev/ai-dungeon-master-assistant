import { CampaignPromptInput } from "./input-schemas";

export function campaignPrompt(input: CampaignPromptInput){
    const locations = input.worldSetting.locations?.map(
        (location) => `
        Name: ${location.name}
        Description: ${location.description}
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

    // NOTE: PlayerName only included for player characters, not NPCs now
    const players = input.players?.map(
        (player) => `
        ${player.isNpc ? "[NPC - DM ONLY CONTEXT]" : "[PLAYER CHARACTER]"}

        ${!player.isNpc ? `PlayerName: ${player.playerName}` : ""}

        CharacterName: ${player.characterName}
        Class: ${player.characterClass}
        Level: ${player.characterLevel}
        Race: ${player.characterRace}

        ${player.age ? `Age: ${player.age}` : ""}
        ${player.gender ? `Gender: ${player.gender}` : ""}
        ${player.appearance ? `Appearance: ${player.appearance}` : ""}
        ${player.alignment ? `Alignment: ${player.alignment}` : ""}
        ${player.backstory ? `Backstory: ${player.backstory}` : ""}
        ${player.motivation ? `Motivation: ${player.motivation}` : ""}
        ${player.goals ? `Goals: ${player.goals}` : ""}
        ${player.fears ? `Fears: ${player.fears}` : ""}
        ${player.secrets ? `Secrets (DM Only): ${player.secrets}` : ""}
        
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