-- CreateTable
CREATE TABLE "WasteCollectionPoints" (
    "id" SERIAL NOT NULL,
    "account" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WasteCollectionPoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteRecords" (
    "id" SERIAL NOT NULL,
    "account" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "wcpId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WasteRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "wasteRecordId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WasteCollectionPoints_account_key" ON "WasteCollectionPoints"("account");

-- AddForeignKey
ALTER TABLE "WasteRecords" ADD CONSTRAINT "WasteRecords_wcpId_fkey" FOREIGN KEY ("wcpId") REFERENCES "WasteCollectionPoints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_wasteRecordId_fkey" FOREIGN KEY ("wasteRecordId") REFERENCES "WasteRecords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
