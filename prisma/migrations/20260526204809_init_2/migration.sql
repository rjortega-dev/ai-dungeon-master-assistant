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
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" UUID NOT NULL,
    "ownerUserId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "gameSystem" TEXT,
    "settingSummary" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveCampaign" (
    "id" UUID NOT NULL,
    "campaignID" UUID NOT NULL,
    "dmUser" UUID NOT NULL,

    CONSTRAINT "ActiveCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
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

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignCharacter" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "characterId" UUID NOT NULL,
    "roleInCampaign" TEXT,
    "startingLevel" INTEGER,
    "notes" TEXT,
    "inventory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" UUID NOT NULL,
    "creatorUserId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "locationType" TEXT,
    "description" TEXT,
    "climate" TEXT,
    "governmentType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignLocation" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryBeat" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "beatType" "BeatType" NOT NULL,
    "sequenceOrder" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryBeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeatTransition" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "fromBeatId" UUID NOT NULL,
    "toBeatId" UUID NOT NULL,
    "transitionType" "TransitionType" NOT NULL,
    "conditionDescription" TEXT,
    "conditionJson" JSONB,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BeatTransition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Campaign_ownerUserId_idx" ON "Campaign"("ownerUserId");

-- CreateIndex
CREATE INDEX "ActiveCampaign_campaignID_idx" ON "ActiveCampaign"("campaignID");

-- CreateIndex
CREATE INDEX "Character_creatorUserId_idx" ON "Character"("creatorUserId");

-- CreateIndex
CREATE INDEX "CampaignCharacter_campaignId_idx" ON "CampaignCharacter"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignCharacter_characterId_idx" ON "CampaignCharacter"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignCharacter_campaignId_characterId_key" ON "CampaignCharacter"("campaignId", "characterId");

-- CreateIndex
CREATE INDEX "Location_creatorUserId_idx" ON "Location"("creatorUserId");

-- CreateIndex
CREATE INDEX "CampaignLocation_campaignId_idx" ON "CampaignLocation"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignLocation_locationId_idx" ON "CampaignLocation"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignLocation_campaignId_locationId_key" ON "CampaignLocation"("campaignId", "locationId");

-- CreateIndex
CREATE INDEX "StoryBeat_campaignId_idx" ON "StoryBeat"("campaignId");

-- CreateIndex
CREATE INDEX "BeatTransition_campaignId_idx" ON "BeatTransition"("campaignId");

-- CreateIndex
CREATE INDEX "BeatTransition_fromBeatId_idx" ON "BeatTransition"("fromBeatId");

-- CreateIndex
CREATE INDEX "BeatTransition_toBeatId_idx" ON "BeatTransition"("toBeatId");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveCampaign" ADD CONSTRAINT "ActiveCampaign_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveCampaign" ADD CONSTRAINT "ActiveCampaign_dmUser_fkey" FOREIGN KEY ("dmUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignCharacter" ADD CONSTRAINT "CampaignCharacter_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignCharacter" ADD CONSTRAINT "CampaignCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignLocation" ADD CONSTRAINT "CampaignLocation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignLocation" ADD CONSTRAINT "CampaignLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryBeat" ADD CONSTRAINT "StoryBeat_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeatTransition" ADD CONSTRAINT "BeatTransition_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "ActiveCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeatTransition" ADD CONSTRAINT "BeatTransition_fromBeatId_fkey" FOREIGN KEY ("fromBeatId") REFERENCES "StoryBeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeatTransition" ADD CONSTRAINT "BeatTransition_toBeatId_fkey" FOREIGN KEY ("toBeatId") REFERENCES "StoryBeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
