'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Logo from '@/public/futebol.png';

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (senha !== confirmSenha) {
            toast({
                title: 'Erro no cadastro',
                description: 'As senhas não coincidem',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao cadastrar');
            }

            toast({
                title: 'Cadastro realizado com sucesso',
                description: 'Redirecionando para o login...',
            });

            router.push('/login');
        } catch (error: any) {
            console.error('Erro ao cadastrar:', error);
            toast({
                title: 'Erro no cadastro',
                description: error.message || 'Ocorreu um erro ao processar sua solicitação',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col  max-sm:p-0 p-4 bg-gradient-to-b from-green-800 to-green-950">
            <Link href="/" className="text-white mb-6 flex items-center max-sm:hidden">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Link>

            <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg max-sm:max-w-full max-sm:h-screen max-sm:rounded-none flex flex-col justify-center">
                <Image src={Logo} alt="Logo" width={90} height={90} className="mb-6 object-fill mx-auto" />
                <h1 className="text-2xl font-bold text-center text-green-800 mb-6">Cadastrar no MatchMaker</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input
                            id="nome"
                            type="text"
                            placeholder="Seu nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="senha">Senha</Label>
                        <Input
                            id="senha"
                            type="password"
                            placeholder="••••••••"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmSenha">Confirmar Senha</Label>
                        <Input
                            id="confirmSenha"
                            type="password"
                            placeholder="••••••••"
                            value={confirmSenha}
                            onChange={(e) => setConfirmSenha(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isLoading}>
                        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <p>
                        Já tem uma conta?{' '}
                        <Link href="/login" className="text-green-700 hover:underline">
                            Entrar
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
