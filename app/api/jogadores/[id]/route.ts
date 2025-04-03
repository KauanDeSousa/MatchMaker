import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Obter jogador específico
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {1
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const jogador = await prisma.jogador.findUnique({
            where: {
                id: Number.parseInt(params.id),
            },
        });

        if (!jogador) {
            return NextResponse.json({ error: 'Jogador não encontrado' }, { status: 404 });
        }

        if (jogador.usuarioId !== userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        return NextResponse.json(jogador);
    } catch (error) {
        console.error('Erro ao buscar jogador:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}

// PUT - Atualizar jogador
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const { nome, posicao, avaliacao } = await req.json();

        // Verificar se o jogador existe e pertence ao usuário
        const jogadorExistente = await prisma.jogador.findUnique({
            where: {
                id: Number.parseInt(params.id),
            },
        });

        if (!jogadorExistente) {
            return NextResponse.json({ error: 'Jogador não encontrado' }, { status: 404 });
        }

        if (jogadorExistente.usuarioId !== userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        const jogadorAtualizado = await prisma.jogador.update({
            where: {
                id: Number.parseInt(params.id),
            },
            data: {
                nome,
                posicao,
                avaliacao,
            },
        });

        return NextResponse.json(jogadorAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar jogador:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}

// DELETE - Excluir jogador
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !('id' in session.user)) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = Number(session.user.id);

        // Verificar se o jogador existe e pertence ao usuário
        const jogadorExistente = await prisma.jogador.findUnique({
            where: {
                id: Number.parseInt(params.id),
            },
        });

        if (!jogadorExistente) {
            return NextResponse.json({ error: 'Jogador não encontrado' }, { status: 404 });
        }

        if (jogadorExistente.usuarioId !== userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        await prisma.jogador.delete({
            where: {
                id: Number.parseInt(params.id),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir jogador:', error);
        return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
    }
}
