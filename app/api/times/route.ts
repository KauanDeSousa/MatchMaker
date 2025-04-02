import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET - Listar times do usuário
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const times = await prisma.time.findMany({
      where: {
        usuarioId: Number.parseInt(session.user.id),
      },
      include: {
        jogadores: true,
      },
      orderBy: {
        nome: "asc",
      },
    })

    // Calcular média de avaliação para cada time
    const timesComMedia = times.map((time) => {
      const jogadores = time.jogadores
      let mediaAvaliacao = 0

      if (jogadores.length > 0) {
        const somaAvaliacoes = jogadores.reduce((acc, jogador) => acc + jogador.avaliacao, 0)
        mediaAvaliacao = somaAvaliacoes / jogadores.length
      }

      return {
        ...time,
        mediaAvaliacao,
      }
    })

    return NextResponse.json(timesComMedia)
  } catch (error) {
    console.error("Erro ao buscar times:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

// POST - Criar novo time
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { nome, jogadoresIds } = await req.json()

    // Criar o time
    const time = await prisma.time.create({
      data: {
        nome,
        usuarioId: Number.parseInt(session.user.id),
      },
    })

    // Adicionar jogadores ao time, se fornecidos
    if (jogadoresIds && jogadoresIds.length > 0) {
      await prisma.jogador.updateMany({
        where: {
          id: {
            in: jogadoresIds.map((id: string) => Number.parseInt(id)),
          },
          usuarioId: Number.parseInt(session.user.id),
        },
        data: {
          timeId: time.id,
        },
      })
    }

    // Buscar o time com jogadores
    const timeCompleto = await prisma.time.findUnique({
      where: {
        id: time.id,
      },
      include: {
        jogadores: true,
      },
    })

    return NextResponse.json(timeCompleto, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar time:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

