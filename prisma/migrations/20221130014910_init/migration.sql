-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "userName" TEXT
);

-- CreateTable
CREATE TABLE "Hanzi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chinese" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "bihua" TEXT NOT NULL,
    "bishun" TEXT NOT NULL,
    "radical" TEXT NOT NULL,
    "fayin" TEXT
);
