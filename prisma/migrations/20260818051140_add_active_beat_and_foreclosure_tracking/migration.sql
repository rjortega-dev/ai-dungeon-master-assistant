/*
  Warnings:

  - A unique constraint covering the columns `[campaignID]` on the table `ActiveCampaign` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ActiveCampaign_campaignID_idx";

-- AlterTable
ALTER TABLE "ActiveCampaign" ADD COLUMN     "activeBeatId" UUID;

-- AlterTable
ALTER TABLE "BeatTransition" ADD COLUMN     "isBranch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "takenAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveCampaign_campaignID_key" ON "ActiveCampaign"("campaignID");

-- CreateIndex
CREATE INDEX "ActiveCampaign_activeBeatId_idx" ON "ActiveCampaign"("activeBeatId");

-- AddForeignKey
ALTER TABLE "ActiveCampaign" ADD CONSTRAINT "ActiveCampaign_activeBeatId_fkey" FOREIGN KEY ("activeBeatId") REFERENCES "StoryBeat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
