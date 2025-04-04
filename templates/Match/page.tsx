'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';

interface Partida {
    id: number;
    data: string;
    timeA: { id: number; nome: string }; // If timeA is an object
    timeB: { id: number; nome: string }; // If timeB is an object
    placarA: number;
    placarB: number;
    status: string;
}

export default function Partidas() {
    const { status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [partidas, setPartidas] = useState<Partida[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            fetchPartidas();
        }
    }, [status, router]);

    const fetchPartidas = async () => {
        try {
            const response = await fetch('/api/partidas');

            if (!response.ok) {
                throw new Error('Erro ao buscar partidas');
            }

            const data = await response.json();

            setPartidas(data);
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'encerrado':
                return (
                    <Badge variant="outline" className="bg-gray-100">
                        Encerrado
                    </Badge>
                );
            case 'em_andamento':
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                        Em andamento
                    </Badge>
                );
            case 'pausado':
                return (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                        Pausado
                    </Badge>
                );
            default:
                return null;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'encerrado':
                return <Clock className="h-4 w-4" />;
            case 'em_andamento':
                return <Play className="h-4 w-4 text-green-700" />;
            case 'pausado':
                return <Pause className="h-4 w-4 text-red-700" />;
            default:
                return null;
        }
    };

    if (status === 'loading' || isLoading) {
        return <Loading />;
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <Header titulo={'Partidas'}>
                <Link href="/dashboard" className="flex items-center text-green-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Link>
            </Header>

            <div className="p-4">
                <div className="mb-4">
                    <Link href="/partidas/nova">
                        <Button className="w-full bg-green-700 hover:bg-green-800">Nova Partida</Button>
                    </Link>
                </div>

                <div className="space-y-4 flex flex-col">
                    {partidas.map((partida) => (
                        <Link key={partida.id} href={`/partidas/${partida.id}`}>
                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm text-gray-500">
                                            {new Date(partida.data).toLocaleDateString()} {new Date(partida.data).toLocaleTimeString()}
                                        </div>
                                        {getStatusBadge(partida.status)}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="text-lg font-medium">{partida.timeA.nome}</div>
                                        <div className="text-xl font-bold">
                                            {partida.placarA} - {partida.placarB}
                                        </div>
                                        <div className="text-lg font-medium">{partida.timeB.nome}</div>
                                    </div>

                                    <div className="flex justify-center mt-2">{getStatusIcon(partida.status)}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
