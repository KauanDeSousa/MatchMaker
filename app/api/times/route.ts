import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Listar times do usuário
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = Number(session.user.id); // Converte para número

        const times = await prisma.time.findMany({
            where: {
                usuarioId: userId,
            },
            include: {
                jogadores: true,
            },
            orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
        });

        // Calcular média de avaliação para cada time
        const timesComMedia = times.map((time) => {
            const jogadores = time.jogadores;
            let mediaAvaliacao = 0;

            if (jogadores.length > 0) {
                const somaAvaliacoes = jogadores.reduce((acc, jogador) => acc + jogador.avaliacao, 0);
                mediaAvaliacao = somaAvaliacoes / jogadores.length;
            }

            return {
                ...time,
                mediaAvaliacao,
            };
        });

        return NextResponse.json(timesComMedia);
    } catch (error) {
        console.error('Erro ao buscar times:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}

// POST - Criar novo time
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = Number(session.user.id); // Converte para número

        const { nome, jogadoresIds } = await req.json();

        // 1. Criar o time
        const time = await prisma.time.create({
            data: {
                nome,
                usuarioId: userId,
                // 2. Conectar jogadores diretamente (se existirem)
                jogadores: {
                    connect: jogadoresIds?.map((id: string) => ({
                        id: Number.parseInt(id),
                    })),
                },
            },
            // 3. Incluir jogadores na resposta
            include: {
                jogadores: true,
            },
        });

        return NextResponse.json(time, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar time:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}
