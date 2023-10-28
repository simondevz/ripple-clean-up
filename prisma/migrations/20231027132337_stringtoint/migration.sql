/*
  Warnings:

  - You are about to alter the column `number` on the `WasteRecords` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WasteRecords" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "account" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "wcpId" INTEGER NOT NULL,
    CONSTRAINT "WasteRecords_wcpId_fkey" FOREIGN KEY ("wcpId") REFERENCES "WasteCollectionPoints" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WasteRecords" ("account", "id", "number", "verified", "wcpId") SELECT "account", "id", "number", "verified", "wcpId" FROM "WasteRecords";
DROP TABLE "WasteRecords";
ALTER TABLE "new_WasteRecords" RENAME TO "WasteRecords";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
