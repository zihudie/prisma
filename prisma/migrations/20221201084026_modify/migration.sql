/*
  Warnings:

  - Added the required column `word` to the `ChineseStudy` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChineseStudy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "begineTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorCounts" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_ChineseStudy" ("begineTime", "errorCounts", "finished", "id") SELECT "begineTime", "errorCounts", "finished", "id" FROM "ChineseStudy";
DROP TABLE "ChineseStudy";
ALTER TABLE "new_ChineseStudy" RENAME TO "ChineseStudy";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
