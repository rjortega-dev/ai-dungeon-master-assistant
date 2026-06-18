-- CreateEnum
CREATE TYPE "LocationStatus" AS ENUM ('SAFE', 'DANGEROUS', 'DESTROYED', 'OCCUPIED', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "importance" TEXT,
ADD COLUMN     "rumors" TEXT,
ADD COLUMN     "secrets" TEXT,
ADD COLUMN     "status" "LocationStatus" NOT NULL DEFAULT 'UNKNOWN';
