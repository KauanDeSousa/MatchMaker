/*
  Warnings:

  - You are about to drop the column `timeId` on the `Jogador` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_JogadoresTimes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_JogadoresTimes_A_fkey" FOREIGN KEY ("A") REFERENCES "Jogador" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_JogadoresTimes_B_fkey" FOREIGN KEY ("B") REFERENCES "Time" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jogador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "posicao" TEXT NOT NULL,
    "imagem" TEXT NOT NULL DEFAULT '',
    "avaliacao" REAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Jogador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Jogador" ("avaliacao", "createdAt", "id", "imagem", "nome", "posicao", "updatedAt", "usuarioId") SELECT "avaliacao", "createdAt", "id", "imagem", "nome", "posicao", "updatedAt", "usuarioId" FROM "Jogador";
DROP TABLE "Jogador";
ALTER TABLE "new_Jogador" RENAME TO "Jogador";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_JogadoresTimes_AB_unique" ON "_JogadoresTimes"("A", "B");

-- CreateIndex
CREATE INDEX "_JogadoresTimes_B_index" ON "_JogadoresTimes"("B");
