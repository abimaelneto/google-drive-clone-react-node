-- CreateEnum
CREATE TYPE "Action" AS ENUM ('READ', 'WRITE', 'DELETE');

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "actions" "Action"[];
