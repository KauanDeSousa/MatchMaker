'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import JogadorCard from '@/components/jogador-card';
import { useToast } from '@/hooks/use-toast';
import { Loading } from '@/components/loading';
import { Header } from '@/components/header';

interface Jogador {
    id: number;
    nome: string;
    avaliacao: number;
    posicao: string;
}

export default function Jogadores() {
    const { status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [jogadores, setJogadores] = useState<Jogador[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            fetchJogadores();
        }
    }, [status, router]);

    const fetchJogadores = async () => {
        try {
            const response = await fetch('/api/jogadores');

            if (!response.ok) {
                throw new Error('Erro ao buscar jogadores');
            }

            const data = await response.json();
            setJogadores(data);
        } catch (error) {
            console.error('Erro ao buscar jogadores:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar os jogadores',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading' || isLoading) {
        return <Loading />;
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <Header titulo={`Jogadores`}>
                <Link href="/dashboard" className="flex items-center text-green-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Link>
            </Header>

            <div className="p-4">
                <div className="mb-4">
                    <Link href="/jogadores/novo">
                        <Button className="w-full bg-green-700 hover:bg-green-800">
                            <Plus className="mr-2 h-4 w-4" /> Adicionar Jogador
                        </Button>
                    </Link>
                </div>

                <div className="space-y-3 flex flex-col gap-3">
                    {jogadores.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">Nenhum jogador cadastrado. Adicione seu primeiro jogador!</div>
                    ) : (
                        jogadores.map((jogador) => <JogadorCard key={jogador.id} jogador={jogador} />)
                    )}
                </div>
            </div>
        </main>
    );
}
