'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';

interface Time {
    id: number;
    nome: string;
    jogadores: { id: number; nome: string; avaliacao: number }[];
    mediaAvaliacao: number;
    status: string;
}

export default function NovaPartida() {
    const [timeA, setTimeA] = useState('');
    const [timeB, setTimeB] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const { status } = useSession();
    const { toast } = useToast();
    const [times, setTimes] = useState<Time[]>([]);
    const router = useRouter();

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
            const time = data.filter((time: { status: string }) => time.status === 'ativo');
            setTimes(time);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/partidas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timeAId: timeA,
                    timeBId: timeB,
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar partida');
            }

            const partida = await response.json();

            toast({
                title: 'Sucesso',
                description: 'Partida criada com sucesso',
            });

            router.push('/partidas/' + partida.id);
        } catch (error) {
            console.error('Erro ao criar partida:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível criar a partida',
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
            <Header titulo={'Nova Partida'}>
                <Link href="/partidas" className="flex items-center text-green-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Link>
            </Header>

            <div className="p-4">
                <Card>
                    <CardContent className="p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="timeA">Time A</Label>
                                <Select value={timeA} onValueChange={setTimeA} required>
                                    <SelectTrigger id="timeA">
                                        <SelectValue placeholder="Selecione o time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {times.map((time) => (
                                            <SelectItem key={time.id} value={time.id.toString()}>
                                                {time.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeB">Time B</Label>
                                <Select value={timeB} onValueChange={setTimeB} required>
                                    <SelectTrigger id="timeB">
                                        <SelectValue placeholder="Selecione o time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {times.map((time) => (
                                            <SelectItem key={time.id} value={time.id.toString()} disabled={time.id.toString() === timeA}>
                                                {time.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={!timeA || !timeB || timeA === timeB}>
                                <Play className="mr-2 h-4 w-4" /> Iniciar Partida
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
