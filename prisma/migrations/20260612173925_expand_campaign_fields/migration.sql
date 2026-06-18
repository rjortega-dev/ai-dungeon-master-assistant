-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "centralConflict" TEXT,
ADD COLUMN     "edition" TEXT,
ADD COLUMN     "endingLevel" INTEGER,
ADD COLUMN     "genre" TEXT,
ADD COLUMN     "inspiration" TEXT,
ADD COLUMN     "isHomebrew" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "primaryThemes" TEXT,
ADD COLUMN     "startingLevel" INTEGER,
ADD COLUMN     "tone" TEXT,
ADD COLUMN     "ultimateGoal" TEXT;
