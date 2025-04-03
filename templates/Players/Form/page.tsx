'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

export default function FormJogador({ params }: { params?: { value: string } }) {
    const { status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [nome, setNome] = useState('');
    const [statusJogador, setStatusJogador] = useState('ativo');
    const [posicao, setPosicao] = useState('');
    const [avaliacao, setAvaliacao] = useState(3);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        if (status === 'authenticated') {
            if (!params?.value) return setIsLoading(false);
            const parsedParams = JSON.parse(params.value);
            fetchJogador(parsedParams.id);
        }
    }, [status, router]);

    const fetchJogador = async (id: string) => {
        try {
            const response = await fetch(`/api/jogadores/${id}`);

            if (!response.ok) {
                throw new Error('Erro ao buscar jogadores');
            }

            const data = await response.json();
            setNome(data.nome);
            setStatusJogador(data.status);
            setPosicao(data.posicao);
            setAvaliacao(data.avaliacao);
        } catch (error) {
            console.error('Erro ao buscar jogador:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar o jogador',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const route = !params?.value ? '/api/jogadores' : `/api/jogadores/${JSON.parse(params.value).id}`;

        try {
            const response = await fetch(route, {
                method: !params?.value ? 'POST' : 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    posicao,
                    avaliacao,
                    status: statusJogador,
                }),
            });

            console.log(response);

            if (!response.ok) {
                throw new Error('Erro ao criar jogador');
            }

            toast({
                title: 'Sucesso',
                description: !params?.value ? 'Jogador adicionado com sucesso' : 'Jogador editado com sucesso.',
            });

            router.push('/jogadores');
        } catch (error) {
            console.error('Erro ao criar jogador:', error);
            toast({
                title: 'Erro',
                description: !params?.value ? 'Não foi possível adicionar o jogador' : 'Não foi possível editar o jogador',
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
                <Link href="/jogadores" className="flex items-center text-green-800">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Link>
                <h1 className="text-xl font-bold text-green-800">{!params ? 'Novo Jogador' : 'Editar Jogador'}</h1>
                <div className="w-6"></div> {/* Espaçador para centralizar o título */}
            </div>

            <div className="bg-white rounded-xl shadow p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Nome do jogador"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="posicao">Status</Label>
                        <Select value={statusJogador} onValueChange={setStatusJogador} required disabled={isLoading}>
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
                        <Label htmlFor="posicao">Posição</Label>
                        <Select value={posicao} onValueChange={setPosicao} required disabled={isLoading}>
                            <SelectTrigger id="posicao">
                                <SelectValue placeholder="Selecione a posição" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="goleiro">Goleiro</SelectItem>
                                <SelectItem value="defesa">Defesa</SelectItem>
                                <SelectItem value="meio-campo">Meio-campo</SelectItem>
                                <SelectItem value="atacante">Atacante</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avaliacao">Avaliação: {avaliacao}</Label>
                        <div className="py-4">
                            <Slider
                                id="avaliacao"
                                min={1}
                                max={5}
                                step={0.5}
                                value={[avaliacao]}
                                onValueChange={(value) => setAvaliacao(value[0])}
                                disabled={isLoading}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isLoading}>
                        {isLoading ? 'Salvando...' : 'Salvar Jogador'}
                    </Button>
                </form>
            </div>
        </main>
    );
}
