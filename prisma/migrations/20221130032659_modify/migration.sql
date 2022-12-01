-- CreateTable
CREATE TABLE "Chinese" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chinese" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "bihua" TEXT NOT NULL,
    "bishun" TEXT NOT NULL,
    "radical" TEXT NOT NULL,
    "fayin" TEXT
);

-- CreateTable
CREATE TABLE "ChineseStudy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "begineTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorCounts" INTEGER NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false
);
