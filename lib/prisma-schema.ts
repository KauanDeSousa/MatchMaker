// Este arquivo é apenas para referência do schema do Prisma
// Em um projeto real, isso estaria no arquivo prisma/schema.prisma

/*
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String   @unique
  senha     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  jogadores Jogador[]
  times     Time[]
  partidas  Partida[]
}

model Jogador {
  id        Int      @id @default(autoincrement())
  nome      String
  posicao   String
  avaliacao Float
  usuarioId Int
  usuario   Usuario  @relation(fields: [usuarioId], references: [id])
  timeId    Int?
  time      Time?    @relation(fields: [timeId], references: [id])
  eventos   Evento[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Time {
  id        Int       @id @default(autoincrement())
  nome      String
  usuarioId Int
  usuario   Usuario   @relation(fields: [usuarioId], references: [id])
  jogadores Jogador[]
  partidasA Partida[] @relation("TimeA")
  partidasB Partida[] @relation("TimeB")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Partida {
  id        Int      @id @default(autoincrement())
  data      DateTime @default(now())
  timeAId   Int
  timeA     Time     @relation("TimeA", fields: [timeAId], references: [id])
  timeBId   Int
  timeB     Time     @relation("TimeB", fields: [timeBId], references: [id])
  placarA   Int      @default(0)
  placarB   Int      @default(0)
  status    String   @default("agendada") // agendada, em_andamento, finalizada
  duracao   Int      @default(0) // em segundos
  usuarioId Int
  usuario   Usuario  @relation(fields: [usuarioId], references: [id])
  eventos   Evento[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Evento {
  id        Int      @id @default(autoincrement())
  tipo      String   // gol, assistencia, cartao_amarelo, cartao_vermelho
  minuto    Int
  partidaId Int
  partida   Partida  @relation(fields: [partidaId], references: [id])
  jogadorId Int
  jogador   Jogador  @relation(fields: [jogadorId], references: [id])
  createdAt DateTime @default(now())
}
*/

