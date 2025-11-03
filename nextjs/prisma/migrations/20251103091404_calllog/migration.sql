/*
  Warnings:

  - You are about to drop the column `accountId` on the `call_log` table. All the data in the column will be lost.
  - You are about to drop the column `receiverType` on the `call_log` table. All the data in the column will be lost.
  - Added the required column `answeredBy` to the `call_log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."call_log" DROP CONSTRAINT "call_log_accountId_fkey";

-- AlterTable
ALTER TABLE "call_log" DROP COLUMN "accountId",
DROP COLUMN "receiverType",
ADD COLUMN     "answeredBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "call_log" ADD CONSTRAINT "call_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
