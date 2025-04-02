"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import JogadorCard from "@/components/jogador-card"
import { useToast } from "@/hooks/use-toast"

interface Jogador {
  id: number
  nome: string
  avaliacao: number
  posicao: string
}

export default function Jogadores() {
  const { status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [jogadores, setJogadores] = useState<Jogador[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetchJogadores()
    }
  }, [status, router])

  const fetchJogadores = async () => {
    try {
      const response = await fetch("/api/jogadores")

      if (!response.ok) {
        throw new Error("Erro ao buscar jogadores")
      }

      const data = await response.json()
      setJogadores(data)
    } catch (error) {
      console.error("Erro ao buscar jogadores:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os jogadores",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="flex items-center text-green-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-xl font-bold text-green-800">Jogadores</h1>
        <div className="w-6"></div> {/* Espaçador para centralizar o título */}
      </div>

      <div className="mb-4">
        <Link href="/jogadores/novo">
          <Button className="w-full bg-green-700 hover:bg-green-800">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Jogador
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {jogadores.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum jogador cadastrado. Adicione seu primeiro jogador!
          </div>
        ) : (
          jogadores.map((jogador) => <JogadorCard key={jogador.id} jogador={jogador} />)
        )}
      </div>
    </main>
  )
}

