'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

interface Time {
    id: number;
    nome: string;
    jogadores: { id: number; nome: string; avaliacao: number }[];
    mediaAvaliacao: number;
    status: string;
}

export default function Times() {
    const { status } = useSession();
    const { toast } = useToast();
    const [times, setTimes] = useState<Time[]>([]);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            fetchTimes();
        }
    }, [status, router]);

    const fetchTimes = async () => {
        try {
            const response = await fetch('/api/times');

            if (!response.ok) {
                throw new Error('Erro ao buscar times');
            }

            const data = await response.json();

            setTimes(data);
        } catch (error) {
            console.error('Erro ao buscar times:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar os times',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-4">
            <div className="flex items-center justify-between mb-6">
                <Link href="/dashboard" className="flex items-center text-green-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Link>
                <h1 className="text-xl font-bold text-green-800">Times</h1>
                <div className="w-6"></div> {/* Espaçador para centralizar o título */}
            </div>

            <div className="mb-4">
                <Link href="/times/gerar">
                    <Button className="w-full bg-green-700 hover:bg-green-800">Gerar Times Equilibrados</Button>
                </Link>
            </div>

            <div className="space-y-4 flex flex-col">
                {times.map((time) => (
                    <Link key={time.id} href={`/times/${time.id}`}>
                        <Card className={`hover:shadow-md transition-shadow ${time.status !== 'ativo' ? 'border-red-800' : ''}`}>
                            <CardContent className={`p-4 ${time.status !== 'ativo' ? 'bg-red-100 text-red-800' : ''}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium text-lg">{time.nome}</h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Users className="h-4 w-4 mr-1" />
                                        <span>{time.jogadores.length} jogadores</span>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-500 mb-2">Média: {time.mediaAvaliacao.toFixed(1)} estrelas</div>

                                <div className="grid grid-cols-2 gap-2">
                                    {time.jogadores.map((jogador) => (
                                        <div key={jogador.id} className="text-sm">
                                            {jogador.nome} ({jogador.avaliacao})
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </main>
    );
}
