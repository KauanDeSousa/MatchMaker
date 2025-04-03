-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jogador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "posicao" TEXT NOT NULL,
    "imagem" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "avaliacao" REAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Jogador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Jogador" ("avaliacao", "createdAt", "id", "imagem", "nome", "posicao", "updatedAt", "usuarioId") SELECT "avaliacao", "createdAt", "id", "imagem", "nome", "posicao", "updatedAt", "usuarioId" FROM "Jogador";
DROP TABLE "Jogador";
ALTER TABLE "new_Jogador" RENAME TO "Jogador";
CREATE TABLE "new_Time" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Time_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Time" ("createdAt", "id", "nome", "updatedAt", "usuarioId") SELECT "createdAt", "id", "nome", "updatedAt", "usuarioId" FROM "Time";
DROP TABLE "Time";
ALTER TABLE "new_Time" RENAME TO "Time";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
