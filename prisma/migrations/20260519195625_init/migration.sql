-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BeatType" AS ENUM ('MAIN_QUEST', 'SIDE_QUEST', 'ENCOUNTER', 'DIALOGUE', 'BOSS', 'ENDING');

-- CreateEnum
CREATE TYPE "TransitionType" AS ENUM ('SUCCESS', 'FAILURE', 'ACCEPT', 'REJECT', 'OPTIONAL', 'SECRET', 'COMBAT_WIN', 'COMBAT_LOSS');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('COMBAT', 'DIALOGUE', 'DISCOVERY', 'QUEST_UPDATE', 'PLAYER_DECISION');

-- CreateEnum
CREATE TYPE "GenerationType" AS ENUM ('CAMPAIGN', 'STORY_BEAT', 'NPC', 'LOCATION');

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL,
    "ownerUserId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "gameSystem" TEXT,
    "settingSummary" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveCampaign" (
    "id" UUID NOT NULL,
    "campaignID" UUID NOT NULL,
    "dmUser" UUID NOT NULL,

    CONSTRAINT "ActiveCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" UUID NOT NULL,
    "creatorUserId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "race" TEXT,
    "class" TEXT,
    "background" TEXT,
    "description" TEXT,
    "isNpc" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_characters" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "characterId" UUID NOT NULL,
    "roleInCampaign" TEXT,
    "startingLevel" INTEGER,
    "notes" TEXT,
    "inventory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "creatorUserId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "locationType" TEXT,
    "description" TEXT,
    "climate" TEXT,
    "governmentType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_locations" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_beats" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "beatType" "BeatType" NOT NULL,
    "sequenceOrder" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "story_beats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beat_transitions" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "fromBeatId" UUID NOT NULL,
    "toBeatId" UUID NOT NULL,
    "transitionType" "TransitionType" NOT NULL,
    "conditionDescription" TEXT,
    "conditionJson" JSONB,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beat_transitions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "campaigns_ownerUserId_idx" ON "campaigns"("ownerUserId");

-- CreateIndex
CREATE INDEX "characters_creatorUserId_idx" ON "characters"("creatorUserId");

-- CreateIndex
CREATE INDEX "campaign_characters_campaignId_idx" ON "campaign_characters"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_characters_characterId_idx" ON "campaign_characters"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_characters_campaignId_characterId_key" ON "campaign_characters"("campaignId", "characterId");

-- CreateIndex
CREATE INDEX "locations_creatorUserId_idx" ON "locations"("creatorUserId");

-- CreateIndex
CREATE INDEX "campaign_locations_campaignId_idx" ON "campaign_locations"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_locations_locationId_idx" ON "campaign_locations"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_locations_campaignId_locationId_key" ON "campaign_locations"("campaignId", "locationId");

-- CreateIndex
CREATE INDEX "story_beats_campaignId_idx" ON "story_beats"("campaignId");

-- CreateIndex
CREATE INDEX "beat_transitions_campaignId_idx" ON "beat_transitions"("campaignId");

-- CreateIndex
CREATE INDEX "beat_transitions_fromBeatId_idx" ON "beat_transitions"("fromBeatId");

-- CreateIndex
CREATE INDEX "beat_transitions_toBeatId_idx" ON "beat_transitions"("toBeatId");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveCampaign" ADD CONSTRAINT "ActiveCampaign_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveCampaign" ADD CONSTRAINT "ActiveCampaign_dmUser_fkey" FOREIGN KEY ("dmUser") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_characters" ADD CONSTRAINT "campaign_characters_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_characters" ADD CONSTRAINT "campaign_characters_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_locations" ADD CONSTRAINT "campaign_locations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_locations" ADD CONSTRAINT "campaign_locations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_beats" ADD CONSTRAINT "story_beats_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beat_transitions" ADD CONSTRAINT "beat_transitions_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "ActiveCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beat_transitions" ADD CONSTRAINT "beat_transitions_fromBeatId_fkey" FOREIGN KEY ("fromBeatId") REFERENCES "story_beats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beat_transitions" ADD CONSTRAINT "beat_transitions_toBeatId_fkey" FOREIGN KEY ("toBeatId") REFERENCES "story_beats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
