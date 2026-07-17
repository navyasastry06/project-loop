-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "analyzedAt" TIMESTAMP(3),
ADD COLUMN     "category" TEXT,
ADD COLUMN     "summary" TEXT;
