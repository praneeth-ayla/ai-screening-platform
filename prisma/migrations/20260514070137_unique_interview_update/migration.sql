/*
  Warnings:

  - You are about to drop the column `status` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `coverLetter` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `screeningFeedback` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `screeningScore` on the `JobApplication` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('PENDING', 'SCHEDULED', 'STARTED', 'COMPLETED', 'FAILED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_applicationId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "status",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "interviewStatus" "InterviewStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ALTER COLUMN "strengths" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "weaknesses" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "isActive",
DROP COLUMN "shortDescription",
DROP COLUMN "skills";

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "coverLetter",
DROP COLUMN "screeningFeedback",
DROP COLUMN "screeningScore";

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
