import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// POST - Gerar times equilibrados
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { jogadoresIds, quantidadeTimes } = await req.json()

    if (!jogadoresIds || jogadoresIds.length < quantidadeTimes) {
      return NextResponse.json(
        { error: "Número insuficiente de jogadores para a quantidade de times" },
        { status: 400 },
      )
    }

    // Buscar jogadores selecionados
    const jogadores = await prisma.jogador.findMany({
      where: {
        id: {
          in: jogadoresIds.map((id: string) => Number.parseInt(id)),
        },
        usuarioId: Number.parseInt(session.user.id),
      },
    })

    // Algoritmo para equilibrar times
    const timesGerados = gerarTimesEquilibrados(jogadores, quantidadeTimes)

    return NextResponse.json(timesGerados)
  } catch (error) {
    console.error("Erro ao gerar times:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

// Função para gerar times equilibrados
function gerarTimesEquilibrados(jogadores: any[], quantidadeTimes: number) {
  // Ordenar jogadores por avaliação (do maior para o menor)
  jogadores.sort((a, b) => b.avaliacao - a.avaliacao)

  // Inicializar times vazios
  const times = Array.from({ length: quantidadeTimes }, (_, i) => ({
    id: i + 1,
    nome: `Time ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
    jogadores: [],
    mediaAvaliacao: 0,
  }))

  // Distribuir jogadores em serpentina para equilibrar
  let direcao = 1 // 1 para frente, -1 para trás
  let timeAtual = 0

  jogadores.forEach((jogador) => {
    times[timeAtual].jogadores.push(jogador)

    // Atualizar índice do próximo time
    timeAtual += direcao

    // Mudar direção se chegou ao início ou fim
    if (timeAtual === quantidadeTimes - 1 || timeAtual === 0) {
      direcao *= -1
    }
  })

  // Calcular média de avaliação para cada time
  times.forEach((time) => {
    const jogadoresTime = time.jogadores
    if (jogadoresTime.length > 0) {
      const somaAvaliacoes = jogadoresTime.reduce((acc, jogador) => acc + jogador.avaliacao, 0)
      time.mediaAvaliacao = somaAvaliacoes / jogadoresTime.length
    }
  })

  return times
}

