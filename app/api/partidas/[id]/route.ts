import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET - Obter partida específica
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const partida = await prisma.partida.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
      include: {
        timeA: {
          include: {
            jogadores: true,
          },
        },
        timeB: {
          include: {
            jogadores: true,
          },
        },
        eventos: {
          include: {
            jogador: true,
          },
          orderBy: {
            minuto: "asc",
          },
        },
      },
    })

    if (!partida) {
      return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 })
    }

    if (partida.usuarioId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    return NextResponse.json(partida)
  } catch (error) {
    console.error("Erro ao buscar partida:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

// PUT - Atualizar partida
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { placarA, placarB, status, duracao } = await req.json()

    // Verificar se a partida existe e pertence ao usuário
    const partidaExistente = await prisma.partida.findUnique({
      where: {
        id: Number.parseInt(params.id),
      },
    })

    if (!partidaExistente) {
      return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 })
    }

    if (partidaExistente.usuarioId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const partidaAtualizada = await prisma.partida.update({
      where: {
        id: Number.parseInt(params.id),
      },
      data: {
        placarA,
        placarB,
        status,
        duracao,
      },
    })

    return NextResponse.json(partidaAtualizada)
  } catch (error) {
    console.error("Erro ao atualizar partida:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

