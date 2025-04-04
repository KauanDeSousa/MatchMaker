'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, Users, Timer, BarChart, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.name) {
            setUserName(session.user.name);
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <Header titulo={`Olá, ${userName || 'Jogador'}!`}>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                        router.push('/api/auth/signout');
                        toast({
                            title: 'Logout realizado',
                            description: 'Você foi desconectado com sucesso',
                        });
                    }}
                >
                    <LogOut className="h-4 w-4" /> Sair
                </Button>
            </Header>
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/jogadores" className="block">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">Jogadores</CardTitle>
                                <UserCircle className="h-5 w-5 text-green-700" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Cadastre e avalie jogadores</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/times" className="block">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">Times</CardTitle>
                                <Users className="h-5 w-5 text-green-700" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Monte times equilibrados</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/partidas" className="block">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">Partidas</CardTitle>
                                <Timer className="h-5 w-5 text-green-700" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Gerencie partidas em andamento</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/estatisticas" className="block">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-medium">Estatísticas</CardTitle>
                                <BarChart className="h-5 w-5 text-green-700" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Veja estatísticas dos jogadores</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
                <div className="mt-6">
                    <Button className="w-full bg-green-700 hover:bg-green-800">
                        <Link href="/partidas/nova">Iniciar Nova Partida</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
