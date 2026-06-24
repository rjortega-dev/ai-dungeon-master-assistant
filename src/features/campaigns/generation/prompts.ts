import { CampaignPromptInput } from "./input-schemas";

// generic prompt builder: pass any generatable entity, optionally pass additional context via another entity type or as string
export function promptBuilder(context: JSON, promptNotes: string){
    const mergedPrompt = {prompt: promptNotes, ...context}
    return JSON.stringify(mergedPrompt)
}

// campaign prompt and instructions
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

export const characterInstructions = `You are an expert tabletop rpg character creator
Use the notes provided and the context and campaign entities provided to generate a new character for the campaign.
Only generate data for the matching schema provided. To assist with the dungeon master's story telling include brief descriptions of a character's personality, motivations, and close relations.
`

export const locationInstructions = `You are an expert tabletop rpg location creator
Use the notes provided and the context and campaign entities provided to generate a new location for the campaign.
Only generate data for the matching schema provided. 

- locations should match the world setting and style
- locations should include descriptions of their physical location relative to existing locations
`

export const sideStoryInstructions = `You are an expert tabletop rpg campaign creator. We want to generate a new side story composed of 3 beats that can fit into the existing campaign.
These beat(s) should act as side quest fillers to give the campaign more depth and color. They should not affect or block the main quest's progression. The first beat transitions from a main story beat. 
The last beat in the new sequence transitions back to the same main story beat the side story transitioned from
A side story can transition from a main story sequence. Side stories can transition to other side story beats. Side stories can not transition to a new main story beat.
Side stories cannot transition in a way that would skip a main story beat. 
Use the notes, the context, and campaign entities provided to generate new story beats for the campaign.
Only generate data for the matching schema provided. 
`