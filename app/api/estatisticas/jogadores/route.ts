import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Obter estatísticas dos jogadores
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = Number(session.user.id);

        // Buscar todos os jogadores do usuário
        const jogadores = await prisma.jogador.findMany({
            where: {
                usuarioId: userId,
            },
        });

        // Buscar eventos de todas as partidas do usuário
        const partidas = await prisma.partida.findMany({
            where: {
                usuarioId: userId,
            },
            select: {
                id: true,
            },
        });

        const partidasIds = partidas.map((p) => p.id);

        const eventos = await prisma.evento.findMany({
            where: {
                partidaId: {
                    in: partidasIds,
                },
            },
            include: {
                jogador: true,
                partida: true,
            },
        });

        // Calcular estatísticas para cada jogador
        const estatisticas = jogadores.map((jogador) => {
            const eventosJogador = eventos.filter((e) => e.jogadorId === jogador.id);

            const gols = eventosJogador.filter((e) => e.tipo === 'gol').length;
            const assistencias = eventosJogador.filter((e) => e.tipo === 'assistencia').length;
            const cartoesAmarelos = eventosJogador.filter((e) => e.tipo === 'cartao_amarelo').length;
            const cartoesVermelhos = eventosJogador.filter((e) => e.tipo === 'cartao_vermelho').length;

            // Contar jogos (partidas únicas em que o jogador teve eventos)
            const jogosIds = [...new Set(eventosJogador.map((e) => e.partidaId))];
            const jogos = jogosIds.length;

            return {
                id: jogador.id,
                nome: jogador.nome,
                gols,
                assistencias,
                cartaoAmarelo: cartoesAmarelos,
                cartaoVermelho: cartoesVermelhos,
                jogos,
                golsPorJogo: jogos > 0 ? gols / jogos : 0,
                assistenciasPorJogo: jogos > 0 ? assistencias / jogos : 0,
            };
        });

        estatisticas.sort((a, b) => {
            if (b.gols !== a.gols) {
                return b.gols - a.gols;
            }
            if (b.assistencias !== a.assistencias) {
                return b.assistencias - a.assistencias;
            }
            return a.jogos - b.jogos;
        });

        // Remover os campos de ordenação antes de retornar
        const resultado = estatisticas.map(({ golsPorJogo, assistenciasPorJogo, ...rest }) => rest);

        return NextResponse.json(resultado);
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}
