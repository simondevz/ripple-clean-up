-- CreateTable
CREATE TABLE "WasteCollectionPoints" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "account" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WasteRecords" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "account" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "wcpId" INTEGER NOT NULL,
    CONSTRAINT "WasteRecords_wcpId_fkey" FOREIGN KEY ("wcpId") REFERENCES "WasteCollectionPoints" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "wasteRecordId" INTEGER NOT NULL,
    CONSTRAINT "Image_wasteRecordId_fkey" FOREIGN KEY ("wasteRecordId") REFERENCES "WasteRecords" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WasteCollectionPoints_account_key" ON "WasteCollectionPoints"("account");
