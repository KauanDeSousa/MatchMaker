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
    "timeId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Jogador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Jogador_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES "Time" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Jogador" ("avaliacao", "createdAt", "id", "nome", "posicao", "timeId", "updatedAt", "usuarioId") SELECT "avaliacao", "createdAt", "id", "nome", "posicao", "timeId", "updatedAt", "usuarioId" FROM "Jogador";
DROP TABLE "Jogador";
ALTER TABLE "new_Jogador" RENAME TO "Jogador";
CREATE TABLE "new_Partida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeAId" INTEGER NOT NULL,
    "timeBId" INTEGER NOT NULL,
    "placarA" INTEGER NOT NULL DEFAULT 0,
    "placarB" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pausado',
    "duracao" INTEGER NOT NULL DEFAULT 0,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Partida_timeAId_fkey" FOREIGN KEY ("timeAId") REFERENCES "Time" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Partida_timeBId_fkey" FOREIGN KEY ("timeBId") REFERENCES "Time" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Partida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Partida" ("createdAt", "data", "duracao", "id", "placarA", "placarB", "status", "timeAId", "timeBId", "updatedAt", "usuarioId") SELECT "createdAt", "data", "duracao", "id", "placarA", "placarB", "status", "timeAId", "timeBId", "updatedAt", "usuarioId" FROM "Partida";
DROP TABLE "Partida";
ALTER TABLE "new_Partida" RENAME TO "Partida";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
