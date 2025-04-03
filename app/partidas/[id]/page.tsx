'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, Plus, Flag, Award, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Jogador {
    id: number;
    nome: string;
}

interface Time {
    id: number;
    nome: string;
    jogadores: Jogador[];
}

interface Evento {
    id: number;
    tipo: string;
    minuto: number;
    jogador: Jogador;
}

interface Partida {
    id: number;
    data: string;
    timeA: Time;
    timeB: Time;
    placarA: number;
    placarB: number;
    status: string;
    duracao: number;
    eventos: Evento[];
}

export default function DetalhePartida({ params }: { params: { id: string } }) {
    const { status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [partida, setPartida] = useState<Partida | null>(null);
    const [tipoEvento, setTipoEvento] = useState('');
    const [timeEvento, setTimeEvento] = useState('');
    const [jogadorEvento, setJogadorEvento] = useState('');
    const [timerAtivo, setTimerAtivo] = useState(false);
    const [tempo, setTempo] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSalvando, setIsSalvando] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            fetchPartida();
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [status, router, params.id]);

    useEffect(() => {
        if (partida) {
            setTempo(partida.duracao);
        }
    }, [partida]);

    useEffect(() => {
        if (timerAtivo) {
            timerRef.current = setInterval(() => {
                setTempo((prevTempo) => prevTempo + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timerAtivo]);

    const fetchPartida = async () => {
        try {
            const response = await fetch(`/api/partidas/${params.id}`);

            if (!response.ok) {
                throw new Error('Erro ao buscar partida');
            }

            const data = await response.json();
            setPartida(data);

            if (data.status === 'em_andamento') {
                setTimerAtivo(true);
            }
        } catch (error) {
            console.error('Erro ao buscar partida:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar a partida',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTimer = async () => {
        if (!partida) return;

        const novoStatus = timerAtivo ? 'pausado' : 'em_andamento';
        setTimerAtivo(!timerAtivo);

        try {
            await fetch(`/api/partidas/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: novoStatus,
                    duracao: tempo,
                    placarA: partida.placarA,
                    placarB: partida.placarB,
                }),
            });
        } catch (error) {
            console.error('Erro ao atualizar status da partida:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível atualizar o status da partida',
                variant: 'destructive',
            });
        }
    };

    const finalizarPartida = async () => {
        if (!partida) return;

        setIsSalvando(true);

        try {
            await fetch(`/api/partidas/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'finalizada',
                    duracao: tempo,
                    placarA: partida.placarA,
                    placarB: partida.placarB,
                }),
            });

            toast({
                title: 'Sucesso',
                description: 'Partida finalizada com sucesso',
            });

            setTimerAtivo(false);
            fetchPartida();
        } catch (error) {
            console.error('Erro ao finalizar partida:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível finalizar a partida',
                variant: 'destructive',
            });
        } finally {
            setIsSalvando(false);
        }
    };

    const registrarEvento = async () => {
        if (!partida || !tipoEvento || !jogadorEvento) {
            toast({
                title: 'Erro',
                description: 'Preencha todos os campos',
                variant: 'destructive',
            });
            return;
        }

        setIsSalvando(true);

        try {
            const response = await fetch(`/api/partidas/${params.id}/eventos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tipo: tipoEvento,
                    jogadorId: Number.parseInt(jogadorEvento),
                    minuto: Math.floor(tempo / 60),
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao registrar evento');
            }

            toast({
                title: 'Sucesso',
                description: 'Evento registrado com sucesso',
            });

            setDialogOpen(false);
            setTipoEvento('');
            setTimeEvento('');
            setJogadorEvento('');

            // Atualizar a partida para mostrar o novo evento
            fetchPartida();
        } catch (error) {
            console.error('Erro ao registrar evento:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível registrar o evento',
                variant: 'destructive',
            });
        } finally {
            setIsSalvando(false);
        }
    };

    const formatarTempo = (segundos: number) => {
        const minutos = Math.floor(segundos / 60);
        const segs = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'finalizada':
                return (
                    <Badge variant="outline" className="bg-gray-100">
                        Finalizada
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

    const getEventoIcon = (tipo: string) => {
        switch (tipo) {
            case 'gol':
                return <Flag className="h-4 w-4 text-green-700" />;
            case 'assistencia':
                return <Award className="h-4 w-4 text-blue-500" />;
            case 'cartao_amarelo':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case 'cartao_vermelho':
                return <AlertTriangle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getJogadoresPorTime = (time: string) => {
        if (!partida) return [];

        return time === 'A' ? partida.timeA.jogadores : partida.timeB.jogadores;
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Carregando...</p>
            </div>
        );
    }

    if (!partida) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Partida não encontrada</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-4">
            <div className="flex items-center justify-between mb-6">
                <Link href="/partidas" className="flex items-center text-green-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Link>
                <h1 className="text-xl font-bold text-green-800">Partida</h1>
                <div className="w-6"></div> {/* Espaçador para centralizar o título */}
            </div>

            <Card className="mb-4">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-500">{new Date(partida.data).toLocaleDateString('pt-BR')}</div>
                        {getStatusBadge(partida.status)}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <div className="text-lg font-medium">{partida.timeA.nome}</div>
                        <div className="text-2xl font-bold">
                            {partida.placarA} - {partida.placarB}
                        </div>
                        <div className="text-lg font-medium">{partida.timeB.nome}</div>
                    </div>

                    <div className="flex justify-center mb-4">
                        <div className="text-xl font-mono">{formatarTempo(tempo)}</div>
                    </div>

                    <div className="flex justify-center space-x-2">
                        {partida.status !== 'finalizada' && (
                            <>
                                <Button
                                    variant={timerAtivo ? 'outline' : 'default'}
                                    className={timerAtivo ? 'border-red-500 text-red-500' : 'bg-green-700 hover:bg-green-800'}
                                    onClick={toggleTimer}
                                    disabled={isSalvando}
                                >
                                    {timerAtivo ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                    {timerAtivo ? 'Pausar' : 'Iniciar'}
                                </Button>

                                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" disabled={isSalvando}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Evento
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Registrar Evento</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="tipo-evento">Tipo de Evento</Label>
                                                <Select value={tipoEvento} onValueChange={setTipoEvento}>
                                                    <SelectTrigger id="tipo-evento">
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="gol">Gol</SelectItem>
                                                        <SelectItem value="assistencia">Assistência</SelectItem>
                                                        <SelectItem value="cartao_amarelo">Cartão Amarelo</SelectItem>
                                                        <SelectItem value="cartao_vermelho">Cartão Vermelho</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="time">Time</Label>
                                                <Select value={timeEvento} onValueChange={setTimeEvento}>
                                                    <SelectTrigger id="time">
                                                        <SelectValue placeholder="Selecione o time" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="A">{partida.timeA.nome}</SelectItem>
                                                        <SelectItem value="B">{partida.timeB.nome}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="jogador">Jogador</Label>
                                                <Select value={jogadorEvento} onValueChange={setJogadorEvento} disabled={!timeEvento}>
                                                    <SelectTrigger id="jogador">
                                                        <SelectValue placeholder="Selecione o jogador" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {getJogadoresPorTime(timeEvento).map((jogador: Jogador) => (
                                                            <SelectItem key={jogador.id} value={jogador.id.toString()}>
                                                                {jogador.nome}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Button
                                                className="w-full bg-green-700 hover:bg-green-800"
                                                onClick={registrarEvento}
                                                disabled={!tipoEvento || !timeEvento || !jogadorEvento || isSalvando}
                                            >
                                                {isSalvando ? 'Registrando...' : 'Registrar'}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Button variant="outline" className="border-red-500 text-red-500" onClick={finalizarPartida} disabled={isSalvando}>
                                    {isSalvando ? 'Finalizando...' : 'Finalizar'}
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-lg font-medium">Eventos da Partida</h2>

                <Card>
                    <CardContent className="p-4">
                        {partida.eventos.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">Nenhum evento registrado</div>
                        ) : (
                            <div className="space-y-2">
                                {partida.eventos.map((evento) => (
                                    <div key={evento.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div className="flex items-center">
                                            {getEventoIcon(evento.tipo)}
                                            <span className="ml-2">{evento.jogador.nome}</span>
                                        </div>
                                        <div className="text-sm text-gray-500">{evento.minuto}'</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
