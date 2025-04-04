'use client';

import Link from 'next/link';
import { ArrowLeft, Award, Flag, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';

interface EstatisticasJogadores {
    id: number;
    nome: string;
    gols: number;
    assistencias: number;
    cartaoAmarelo: number;
    cartaoVermelho: number;
    jogos: number;
}

interface EstatisticasTimes {
    id: number;
    nome: string;
    vitorias: number;
    empates: number;
    derrotas: number;
    golsMarcados: number;
    golsSofridos: number;
}

export default function Estatisticas() {
    // Dados de exemplo - seriam carregados do banco de dados

    const { status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [estatisticasJogadores, setEstatisticasJogadores] = useState<EstatisticasJogadores[]>([]);
    const [estatisticasTimes, setEstatisticasTimes] = useState<EstatisticasTimes[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            fetchEstatisticas();
        }
    }, [status, router]);

    const fetchEstatisticas = async () => {
        try {
            setIsLoading(true);

            const [jogadoresResponse, timesResponse] = await Promise.all([
                fetch('/api/estatisticas/jogadores'),
                fetch('/api/estatisticas/times'), // Substitua pela sua segunda rota
            ]);

            if (!jogadoresResponse.ok || !timesResponse.ok) {
                throw new Error('Erro ao buscar dados');
            }

            const [jogadoresData, timesData] = await Promise.all([jogadoresResponse.json(), timesResponse.json()]);

            setEstatisticasJogadores(jogadoresData);
            setEstatisticasTimes(timesData);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar os dados',
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
            <Header titulo={'Estatísticas'}>
                <Link href="/dashboard" className="flex items-center text-green-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Link>
            </Header>

            <div className="p-4">
                <Tabs defaultValue="jogadores" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="jogadores">Jogadores</TabsTrigger>
                        <TabsTrigger value="times">Times</TabsTrigger>
                    </TabsList>

                    <TabsContent value="jogadores">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Estatísticas de Jogadores</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2">Jogador</th>
                                                <th className="text-center py-2">
                                                    <Flag className="h-4 w-4 inline" />
                                                </th>
                                                <th className="text-center py-2">
                                                    <Award className="h-4 w-4 inline" />
                                                </th>
                                                <th className="text-center py-2">
                                                    <AlertTriangle className="h-4 w-4 inline text-yellow-500" />
                                                </th>
                                                <th className="text-center py-2">
                                                    <AlertTriangle className="h-4 w-4 inline text-red-500" />
                                                </th>
                                                <th className="text-center py-2">Jogos</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {estatisticasJogadores.map((jogador) => (
                                                <tr key={jogador.id} className="border-b">
                                                    <td className="py-2">{jogador.nome}</td>
                                                    <td className="text-center py-2">{jogador.gols}</td>
                                                    <td className="text-center py-2">{jogador.assistencias}</td>
                                                    <td className="text-center py-2">{jogador.cartaoAmarelo}</td>
                                                    <td className="text-center py-2">{jogador.cartaoVermelho}</td>
                                                    <td className="text-center py-2">{jogador.jogos}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="times">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Estatísticas de Times</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2">Time</th>
                                                <th className="text-center py-2">V</th>
                                                <th className="text-center py-2">E</th>
                                                <th className="text-center py-2">D</th>
                                                <th className="text-center py-2">GM</th>
                                                <th className="text-center py-2">GS</th>
                                                <th className="text-center py-2">SG</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {estatisticasTimes.map((time) => (
                                                <tr key={time.id} className="border-b">
                                                    <td className="py-2">{time.nome}</td>
                                                    <td className="text-center py-2">{time.vitorias}</td>
                                                    <td className="text-center py-2">{time.empates}</td>
                                                    <td className="text-center py-2">{time.derrotas}</td>
                                                    <td className="text-center py-2">{time.golsMarcados}</td>
                                                    <td className="text-center py-2">{time.golsSofridos}</td>
                                                    <td className="text-center py-2">{time.golsMarcados - time.golsSofridos}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
