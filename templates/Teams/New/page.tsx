'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Users, Shuffle, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Jogador {
    id: number;
    nome: string;
    avaliacao: number;
    posicao: string;
    selecionado: boolean;
}

export default function CriarTime() {
    const { status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [jogadores, setJogadores] = useState<Jogador[]>([]);
    const [quantidadeJogadoresTimes, setQuantidadeJogadoresTimes] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [isGerando, setIsGerando] = useState(false);
    const [nome, setNome] = useState('');
    const [statusTime, setStatusTime] = useState('ativo');

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
            setJogadores(data.map((j: any) => ({ ...j, selecionado: false })));
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

    const toggleJogador = (id: number) => {
        setJogadores(jogadores.map((jogador) => (jogador.id === id ? { ...jogador, selecionado: !jogador.selecionado } : jogador)));
    };

    const salvarTime = async () => {
        const jogadoresSelecionados = jogadores.filter((j) => j.selecionado);

        if (!nome) {
            toast({
                title: 'Erro',
                description: 'Selecione  o nome para criar o time corretamente.',
                variant: 'destructive',
            });
            return;
        }

        setIsGerando(true);

        try {
            // Salvar os times gerados no banco de dados

            const response = await fetch('/api/times', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: nome,
                    jogadoresIds: jogadoresSelecionados.map((j) => j.id),
                    status: statusTime,
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao salvar o time ${nome}`);
            }

            toast({
                title: 'Sucesso',
                description: `Time ${nome} criado com sucesso`,
            });

            router.push('/times');
        } catch (error) {
            console.error('Erro ao salvar times:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível criar o time',
                variant: 'destructive',
            });
        } finally {
            setIsGerando(false);
        }
    };

    if (status === 'loading' || isLoading) {
        return <Loading />;
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <Header titulo={'Novo Time'}>
                <Link href="/times" className="flex items-center text-green-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Link>
            </Header>

            <div className="p-4">
                <Card className="mb-4">
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantidade">Nome do time</Label>
                                <Input value={nome} onChange={(e) => setNome(e.target.value)} id="quantidade" type="text" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="posicao">Status</Label>
                                <Select value={statusTime} onValueChange={setStatusTime} required disabled={isLoading}>
                                    <SelectTrigger id="posicao">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ativo">Ativo</SelectItem>
                                        <SelectItem value="inativo">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantidadeJogadores">Quantidade de Jogadores por Time</Label>
                                <Input
                                    id="quantidadeJogadores"
                                    type="number"
                                    min={2}
                                    max={11}
                                    value={quantidadeJogadoresTimes}
                                    onChange={(e) => setQuantidadeJogadoresTimes(Number.parseInt(e.target.value))}
                                    disabled={isGerando}
                                />
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Selecione os Jogadores</h3>
                                {jogadores.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500">Nenhum jogador cadastrado. Adicione jogadores primeiro!</div>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {jogadores.map((jogador) => (
                                            <div key={jogador.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`jogador-${jogador.id}`}
                                                    checked={jogador.selecionado}
                                                    onCheckedChange={() => toggleJogador(jogador.id)}
                                                    disabled={isGerando}
                                                />
                                                <Label htmlFor={`jogador-${jogador.id}`} className="flex-1">
                                                    {jogador.nome} ({jogador.avaliacao}) - {jogador.posicao}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={salvarTime}
                                className="w-full bg-green-700 hover:bg-green-800"
                                disabled={jogadores.filter((j) => j.selecionado).length !== quantidadeJogadoresTimes || isGerando}
                            >
                                {isGerando ? (
                                    'Gerando...'
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" /> Criar Time
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
