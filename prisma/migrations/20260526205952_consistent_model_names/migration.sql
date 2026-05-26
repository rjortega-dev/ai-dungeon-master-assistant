/*
  Warnings:

  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "comments";

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);
