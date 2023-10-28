-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "wasteRecordId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Image_wasteRecordId_fkey" FOREIGN KEY ("wasteRecordId") REFERENCES "WasteRecords" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "url", "wasteRecordId") SELECT "id", "url", "wasteRecordId" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_WasteCollectionPoints" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "account" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_WasteCollectionPoints" ("account", "address", "id", "name") SELECT "account", "address", "id", "name" FROM "WasteCollectionPoints";
DROP TABLE "WasteCollectionPoints";
ALTER TABLE "new_WasteCollectionPoints" RENAME TO "WasteCollectionPoints";
CREATE UNIQUE INDEX "WasteCollectionPoints_account_key" ON "WasteCollectionPoints"("account");
CREATE TABLE "new_WasteRecords" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "account" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "wcpId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WasteRecords_wcpId_fkey" FOREIGN KEY ("wcpId") REFERENCES "WasteCollectionPoints" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WasteRecords" ("account", "id", "number", "verified", "wcpId") SELECT "account", "id", "number", "verified", "wcpId" FROM "WasteRecords";
DROP TABLE "WasteRecords";
ALTER TABLE "new_WasteRecords" RENAME TO "WasteRecords";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
