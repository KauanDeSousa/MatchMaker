import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// POST - Adicionar evento a uma partida
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { tipo, jogadorId, minuto } = await req.json()

    // Verificar se a partida existe e pertence ao usuário
    const partida = await prisma.partida.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    if (!partida) {
      return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 })
    }

    if (partida.usuarioId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    // Verificar se o jogador existe
    const jogador = await prisma.jogador.findUnique({
      where: {
        id: Number.parseInt(jogadorId),
      },
    })

    if (!jogador) {
      return NextResponse.json({ error: "Jogador não encontrado" }, { status: 404 })
    }

    // Criar o evento
    const evento = await prisma.evento.create({
      data: {
        tipo,
        minuto,
        partidaId: Number.parseInt(params.id),
        jogadorId: Number.parseInt(jogadorId),
      },
      include: {
        jogador: true,
      },
    })

    // Se for um gol, atualizar o placar
    if (tipo === "gol") {
      // Verificar se o jogador pertence ao time A ou B
      const timeA = await prisma.time.findUnique({
        where: {
          id: partida.timeAId,
        },
        include: {
          jogadores: {
            select: {
              id: true,
            },
          },
        },
      })

      const jogadoresTimeA = timeA?.jogadores.map((j) => j.id) || []

      if (jogadoresTimeA.includes(Number.parseInt(jogadorId))) {
        // Gol do time A
        await prisma.partida.update({
          where: {
            id: Number.parseInt(params.id),
          },
          data: {
            placarA: partida.placarA + 1,
          },
        })
      } else {
        // Gol do time B
        await prisma.partida.update({
          where: {
            id: Number.parseInt(params.id),
          },
          data: {
            placarB: partida.placarB + 1,
          },
        })
      }
    }

    return NextResponse.json(evento, { status: 201 })
  } catch (error) {
    console.error("Erro ao adicionar evento:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

