/*
  Warnings:

  - Added the required column `bishun` to the `Hanzi` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hanzi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chinese" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "bihua" TEXT NOT NULL,
    "bishun" TEXT NOT NULL,
    "radical" TEXT NOT NULL,
    "fayin" TEXT
);
INSERT INTO "new_Hanzi" ("bihua", "chinese", "fayin", "id", "pinyin", "radical") SELECT "bihua", "chinese", "fayin", "id", "pinyin", "radical" FROM "Hanzi";
DROP TABLE "Hanzi";
ALTER TABLE "new_Hanzi" RENAME TO "Hanzi";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
