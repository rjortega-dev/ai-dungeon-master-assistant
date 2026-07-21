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
    YOU ARE DESIGNING A TABLETOP RPG CAMPAIGN.

    === CORE CAMPAIGN INFO ===
    CampaignName: ${input.campaignName}
    WorldSetting: ${input.worldSetting.name}
    Edition: ${input.edition ?? "unspecified"}
    SettingStyle: ${input.worldSetting.settingStyle}
    Homebrew Setting: ${input.isHomebrew ? "Yes" : "No"}

    === NARRATIVE DIRECTION (CRITICAL) ===
    Genre: ${input.genre ?? "unspecified"}
    Tone: ${input.tone ?? "unspecified"}
    Primary Themes: ${input.primaryThemes ?? "none provided"}
    Inspiration: ${input.inspiration ?? "none provided"}
    Central Conflict: ${input.centralConflict ?? "none provided"}
    Ultimate Goal: ${input.ultimateGoal ?? "none provided"}

    === GAME STRUCTURE ===
    Starting Level: ${input.startingLevel ?? "unspecified"}
    Ending Level: ${input.endingLevel ?? "unspecified"}

    === CHARACTERS ===
    ${players}

    === LOCATIONS ===
    ${locations}

    === EXISTING STORY BEATS (if any) ===
    ${storyBeats}

    === DESIGN REQUIREMENTS ===
    - Tone MUST be consistent with the "Tone" field
    - Genre MUST influence worldbuilding, enemies, and quest structure
    - Central Conflict MUST drive the main story arc
    - Ultimate Goal MUST define the final campaign resolution
    - Starting/Ending Level MUST influence difficulty scaling
    - Inspiration should shape narrative themes and quest design

    Return a fully structured campaign in valid JSON matching the schema.
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