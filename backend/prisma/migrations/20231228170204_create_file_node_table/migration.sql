-- CreateTable
CREATE TABLE "FileNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "content" TEXT,
    "isFolder" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FileNode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileNode" ADD CONSTRAINT "FileNode_ownerEmail_fkey" FOREIGN KEY ("ownerEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
