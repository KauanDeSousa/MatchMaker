import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Obter time específico
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const time = await prisma.time.findUnique({
            where: {
                id: Number.parseInt(params.id),
            },
            include: {
                jogadores: true,
            },
        });

        if (!time) {
            return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 });
        }

        if (time.usuarioId !== userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        return NextResponse.json(time);
    } catch (error) {
        console.error('Erro ao buscar time:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}

// PUT - Atualizar time
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const { nome, status } = await req.json();

        // Verificar se o time existe e pertence ao usuário
        const timeExistente = await prisma.time.findUnique({
            where: {
                id: Number.parseInt(params.id),
            },
        });

        if (!timeExistente) {
            return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 });
        }

        if (timeExistente.usuarioId !== userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        const timeAtualizado = await prisma.time.update({
            where: {
                id: Number.parseInt(params.id),
            },
            data: {
                nome,
                status,
            },
        });

        return NextResponse.json(timeAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar time:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}
