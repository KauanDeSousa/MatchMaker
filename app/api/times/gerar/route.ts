import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface Jogador {
    id: number;
    nome: string;
    avaliacao: number;
    posicao?: string;
    // Outros campos conforme necessário
}

interface Time {
    id: number;
    nome: string;
    jogadores: Jogador[];
    mediaAvaliacao: number;
}

// POST - Gerar times equilibrados
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const { jogadoresIds, quantidadeTimes, quantidadeJogadoresTimes } = await req.json();

        if (!jogadoresIds || jogadoresIds.length < quantidadeTimes) {
            return NextResponse.json({ error: 'Número insuficiente de jogadores para a quantidade de times' }, { status: 400 });
        }

        if (!jogadoresIds || jogadoresIds.length !== quantidadeTimes * quantidadeJogadoresTimes) {
            return NextResponse.json({ error: 'Número insuficiente de jogadores para a quantidade de times e jogadores por time' }, { status: 400 });
        }

        // Buscar jogadores selecionados E times existentes
        const [jogadores, timesExistentes] = await Promise.all([
            prisma.jogador.findMany({
                where: {
                    id: {
                        in: jogadoresIds.map((id: string) => Number.parseInt(id)),
                    },
                    usuarioId: userId,
                },
            }),
            prisma.time.findMany({
                where: {
                    usuarioId: userId,
                },
                select: {
                    nome: true,
                },
            }),
        ]);

        // Extrair apenas os nomes dos times existentes
        const nomesTimesExistentes = timesExistentes.map((time) => time.nome);

        // Algoritmo para equilibrar times com nomes únicos
        const timesGerados = gerarTimesEquilibrados(jogadores, quantidadeTimes, nomesTimesExistentes, quantidadeJogadoresTimes);

        return NextResponse.json(timesGerados);
    } catch (error) {
        console.error('Erro ao gerar times:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}

function gerarTimesEquilibrados(jogadores: Jogador[], quantidadeTimes: number, nomesExistentes: string[] = [], quantidadeJogadoresTimes: number) {
    // Ordenar jogadores por avaliação (do maior para o menor)
    jogadores.sort((a, b) => b.avaliacao - a.avaliacao);

    // Gerar nomes únicos para os times
    const nomesTimes: string[] = [];
    let contador = 0;

    while (nomesTimes.length < quantidadeTimes) {
        const letra = String.fromCharCode(65 + contador);
        const nomeProposto = `Time ${letra}`;

        if (!nomesExistentes.includes(nomeProposto)) {
            nomesTimes.push(nomeProposto);
        }

        contador++;

        if (contador > 25) {
            const nomeAlternativo = `Time ${nomesTimes.length + 1}`;
            if (!nomesExistentes.includes(nomeAlternativo)) {
                nomesTimes.push(nomeAlternativo);
            }
        }
    }

    // Inicializar times vazios com nomes únicos
    const times: Time[] = nomesTimes.slice(0, quantidadeTimes).map((nome, i) => ({
        id: i + 1,
        nome,
        jogadores: [],
        mediaAvaliacao: 0,
    }));

    // Distribuir jogadores equilibradamente
    for (let i = 0; i < quantidadeJogadoresTimes; i++) {
        // Alternar a direção a cada rodada para equilibrar
        const direction = i % 2 === 0 ? 1 : -1;

        for (let t = 0; t < quantidadeTimes; t++) {
            const teamIndex = direction === 1 ? t : quantidadeTimes - 1 - t;
            const playerIndex = i * quantidadeTimes + t;

            if (playerIndex < jogadores.length) {
                times[teamIndex].jogadores.push(jogadores[playerIndex]);
            }
        }
    }

    // Calcular média de avaliação para cada time
    times.forEach((time) => {
        if (time.jogadores.length > 0) {
            time.mediaAvaliacao = time.jogadores.reduce((acc, jogador: { avaliacao: number }) => acc + jogador.avaliacao, 0) / time.jogadores.length;
        }
    });

    return times;
}
