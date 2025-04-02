import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET - Listar partidas do usuário
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const partidas = await prisma.partida.findMany({
      where: {
        usuarioId: Number.parseInt(session.user.id),
      },
      include: {
        timeA: true,
        timeB: true,
        eventos: {
          include: {
            jogador: true,
          },
        },
      },
      orderBy: {
        data: "desc",
      },
    })

    return NextResponse.json(partidas)
  } catch (error) {
    console.error("Erro ao buscar partidas:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

// POST - Criar nova partida
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { timeAId, timeBId } = await req.json()

    // Verificar se os times existem e pertencem ao usuário
    const timeA = await prisma.time.findUnique({
      where: {
        id: Number.parseInt(timeAId),
      },
    })

    const timeB = await prisma.time.findUnique({
      where: {
        id: Number.parseInt(timeBId),
      },
    })

    if (!timeA || !timeB) {
      return NextResponse.json({ error: "Time não encontrado" }, { status: 404 })
    }

    if (timeA.usuarioId !== Number.parseInt(session.user.id) || timeB.usuarioId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    // Criar a partida
    const partida = await prisma.partida.create({
      data: {
        timeAId: Number.parseInt(timeAId),
        timeBId: Number.parseInt(timeBId),
        usuarioId: Number.parseInt(session.user.id),
        status: "em_andamento",
      },
      include: {
        timeA: true,
        timeB: true,
      },
    })

    return NextResponse.json(partida, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar partida:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

