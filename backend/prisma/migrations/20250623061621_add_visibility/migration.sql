-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'private';

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
