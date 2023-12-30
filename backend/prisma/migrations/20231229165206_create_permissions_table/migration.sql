-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "fileNodeId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "recursive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_fileNodeId_fkey" FOREIGN KEY ("fileNodeId") REFERENCES "FileNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
