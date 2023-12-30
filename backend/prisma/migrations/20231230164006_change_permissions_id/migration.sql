/*
  Warnings:

  - The primary key for the `Permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Permission` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Action" AS ENUM ('READ', 'WRITE', 'DELETE');

-- AlterTable
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_pkey",
DROP COLUMN "id",
ADD COLUMN     "actions" "Action"[],
ADD CONSTRAINT "Permission_pkey" PRIMARY KEY ("fileNodeId", "userEmail");
