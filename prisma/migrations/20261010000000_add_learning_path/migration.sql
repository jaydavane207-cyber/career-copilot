-- CreateEnum
CREATE TYPE "LearningPathFocusMode" AS ENUM ('BALANCED', 'OA_FIRST', 'INTERVIEW_FIRST');

-- CreateEnum
CREATE TYPE "LearningTaskType" AS ENUM ('LEARN', 'PRACTICE', 'REVISE', 'MOCK');

-- CreateEnum
CREATE TYPE "LearningTaskStatus" AS ENUM ('PENDING', 'DONE', 'SKIPPED');

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetRoleKey" TEXT,
    "durationWeeks" INTEGER NOT NULL,
    "hoursPerWeek" INTEGER NOT NULL,
    "focusMode" "LearningPathFocusMode" NOT NULL DEFAULT 'BALANCED',
    "sourceResumeAnalysisId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningWeek" (
    "id" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "skillIds" JSONB NOT NULL,
    "goalSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningTask" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "LearningTaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationMin" INTEGER NOT NULL,
    "resourceUrl" TEXT,
    "resourceTitle" TEXT,
    "skillIds" JSONB NOT NULL,
    "status" "LearningTaskStatus" NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearningPath_userId_createdAt_idx" ON "LearningPath"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "LearningWeek_pathId_idx" ON "LearningWeek"("pathId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningWeek_pathId_weekNumber_key" ON "LearningWeek"("pathId", "weekNumber");

-- CreateIndex
CREATE INDEX "LearningTask_userId_status_idx" ON "LearningTask"("userId", "status");

-- CreateIndex
CREATE INDEX "LearningTask_pathId_idx" ON "LearningTask"("pathId");

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningWeek" ADD CONSTRAINT "LearningWeek_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningTask" ADD CONSTRAINT "LearningTask_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "LearningWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningTask" ADD CONSTRAINT "LearningTask_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningTask" ADD CONSTRAINT "LearningTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
