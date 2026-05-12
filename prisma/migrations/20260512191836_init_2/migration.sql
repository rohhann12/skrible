-- CreateTable
CREATE TABLE "Room" (
    "roomId" TEXT NOT NULL,
    "userConnected" TEXT[],

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomId_key" ON "Room"("roomId");
