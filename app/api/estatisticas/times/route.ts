import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

// GET - Obter estatísticas dos times
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar todos os times do usuário
    const times = await prisma.time.findMany({
      where: {
        usuarioId: Number.parseInt(session.user.id),
      },
    })

    // Buscar todas as partidas finalizadas
    const partidas = await prisma.partida.findMany({
      where: {
        usuarioId: Number.parseInt(session.user.id),
        status: "finalizada",
      },
    })

    // Calcular estatísticas para cada time
    const estatisticas = times.map((time) => {
      const partidasTimeA = partidas.filter((p) => p.timeAId === time.id)
      const partidasTimeB = partidas.filter((p) => p.timeBId === time.id)

      let vitorias = 0
      let empates = 0
      let derrotas = 0
      let golsMarcados = 0
      let golsSofridos = 0

      // Calcular resultados quando o time joga como Time A
      partidasTimeA.forEach((partida) => {
        golsMarcados += partida.placarA
        golsSofridos += partida.placarB

        if (partida.placarA > partida.placarB) {
          vitorias++
        } else if (partida.placarA === partida.placarB) {
          empates++
        } else {
          derrotas++
        }
      })

      // Calcular resultados quando o time joga como Time B
      partidasTimeB.forEach((partida) => {
        golsMarcados += partida.placarB
        golsSofridos += partida.placarA

        if (partida.placarB > partida.placarA) {
          vitorias++
        } else if (partida.placarB === partida.placarA) {
          empates++
        } else {
          derrotas++
        }
      })

      return {
        id: time.id,
        nome: time.nome,
        vitorias,
        empates,
        derrotas,
        golsMarcados,
        golsSofridos,
      }
    })

    return NextResponse.json(estatisticas)
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

