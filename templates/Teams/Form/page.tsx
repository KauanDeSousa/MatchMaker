'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Users, Shuffle, Edit } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Jogador {
    avaliacao: number;
    createdAt: string;
    id: number;
    imagem: string;
    nome: string;
    posicao: string;
    status: string;
    updatedAt: string;
    usuarioId: number;
}

interface Time {
    createdAt: string;
    id: number;
    jogadores: Jogador[];
    nome: string;
    status: string;
    updatedAt: string;
    usuarioId: number;
}

export default function FormTime({ params }: { params: { value: string } }) {
    const { status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [time, setTime] = useState<Time>();
    const [isLoading, setIsLoading] = useState(true);
    const [nome, setNome] = useState('');
    const [statusTime, setStatusTime] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            if (!params?.value) return setIsLoading(false);
            const parsedParams = JSON.parse(params.value);
            fetchTime(parsedParams.id);
        }
    }, [status, router]);

    const fetchTime = async (id: string) => {
        try {
            const response = await fetch(`/api/times/${id}`);

            if (!response.ok) {
                throw new Error('Erro ao buscar jogadores');
            }

            const data = await response.json();
            setTime(data);
            setNome(data.nome);
            setStatusTime(data.status);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`/api/times/${JSON.parse(params.value).id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    status: statusTime,
                }),
            });

            console.log(response);

            if (!response.ok) {
                throw new Error('Erro ao criar jogador');
            }

            toast({
                title: 'Sucesso',
                description: 'Time editado com sucesso.',
            });

            router.push('/times');
        } catch (error) {
            console.error('Erro ao editar time:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível editar o time',
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
                <Link href="/times" className="flex items-center text-green-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Link>
                <h1 className="text-xl font-bold text-green-800">Editar Time</h1>
                <div className="w-6"></div> {/* Espaçador para centralizar o título */}
            </div>

            <Card className="mb-4">
                <CardContent className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div>
                            <h3 className="font-medium mb-2">Jogadores</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {time &&
                                    time.jogadores.map((jogador) => (
                                        <div key={jogador.id} className="flex items-center space-x-2">
                                            <Label htmlFor={`jogador-${jogador.id}`} className="flex-1">
                                                {jogador.nome} ({jogador.avaliacao}) - {jogador.posicao}
                                            </Label>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isLoading}>
                            {isLoading ? (
                                'Salvando...'
                            ) : (
                                <>
                                    <Edit className="h-4 w-4" /> Editar time
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
