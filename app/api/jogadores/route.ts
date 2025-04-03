import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Listar jogadores do usuário
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = Number(session.user.id); // Converte para número

        const jogadores = await prisma.jogador.findMany({
            where: {
                usuarioId: userId,
            },
            orderBy: {
                nome: 'asc',
            },
        });

        return NextResponse.json(jogadores);
    } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}

// POST - Criar novo jogador
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { nome, posicao, avaliacao, status } = await req.json();

        const userId = Number(session.user.id); // Converte para número

        const jogador = await prisma.jogador.create({
            data: {
                nome,
                posicao,
                avaliacao,
                usuarioId: userId,
                status,
            },
        });

        return NextResponse.json(jogador, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar jogador:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}
