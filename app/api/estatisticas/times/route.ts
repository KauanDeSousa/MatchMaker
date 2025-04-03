import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Obter estatísticas dos times
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = Number(session.user.id);

        // Buscar todos os times do usuário
        const times = await prisma.time.findMany({
            where: {
                usuarioId: userId,
            },
        });

        // Buscar todas as partidas finalizadas
        const partidas = await prisma.partida.findMany({
            where: {
                usuarioId: userId,
                status: 'encerrado',
            },
        });

        // Calcular estatísticas para cada time
        const estatisticas = times
            .map((time) => {
                const partidasTimeA = partidas.filter((p) => p.timeAId === time.id);
                const partidasTimeB = partidas.filter((p) => p.timeBId === time.id);
                const totalPartidas = partidasTimeA.length + partidasTimeB.length;

                // Se o time não jogou nenhuma partida, retornar null para filtrar depois
                if (totalPartidas === 0) return null;

                let vitorias = 0;
                let empates = 0;
                let derrotas = 0;
                let golsMarcados = 0;
                let golsSofridos = 0;

                // Calcular resultados quando o time joga como Time A
                partidasTimeA.forEach((partida) => {
                    golsMarcados += partida.placarA;
                    golsSofridos += partida.placarB;

                    if (partida.placarA > partida.placarB) {
                        vitorias++;
                    } else if (partida.placarA === partida.placarB) {
                        empates++;
                    } else {
                        derrotas++;
                    }
                });

                // Calcular resultados quando o time joga como Time B
                partidasTimeB.forEach((partida) => {
                    golsMarcados += partida.placarB;
                    golsSofridos += partida.placarA;

                    if (partida.placarB > partida.placarA) {
                        vitorias++;
                    } else if (partida.placarB === partida.placarA) {
                        empates++;
                    } else {
                        derrotas++;
                    }
                });

                return {
                    id: time.id,
                    nome: time.nome,
                    partidasJogadas: totalPartidas,
                    vitorias,
                    empates,
                    derrotas,
                    golsMarcados,
                    golsSofridos,
                    saldoGols: golsMarcados - golsSofridos,
                    pontos: vitorias * 3 + empates,
                };
            })
            // Filtrar para remover times que não jogaram nenhuma partida
            .filter((time) => time !== null);

        // Ordenar os times:
        estatisticas.sort((a, b) => {
            // 1. Maior número de pontos
            if (b.pontos !== a.pontos) return b.pontos - a.pontos;

            // 2. Maior saldo de gols
            if (b.saldoGols !== a.saldoGols) return b.saldoGols - a.saldoGols;

            // 3. Mais gols marcados
            return b.golsMarcados - a.golsMarcados;
        });

        return NextResponse.json(estatisticas);
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}
