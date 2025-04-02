"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Users, Shuffle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface Jogador {
  id: number
  nome: string
  avaliacao: number
  posicao: string
  selecionado: boolean
}

interface Time {
  id: number
  nome: string
  jogadores: Jogador[]
  mediaAvaliacao: number
}

export default function GerarTimes() {
  const { status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [jogadores, setJogadores] = useState<Jogador[]>([])
  const [quantidadeTimes, setQuantidadeTimes] = useState(2)
  const [timesGerados, setTimesGerados] = useState<Time[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGerando, setIsGerando] = useState(false)

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
      setJogadores(data.map((j: any) => ({ ...j, selecionado: false })))
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

  const toggleJogador = (id: number) => {
    setJogadores(
      jogadores.map((jogador) => (jogador.id === id ? { ...jogador, selecionado: !jogador.selecionado } : jogador)),
    )
  }

  const gerarTimes = async () => {
    const jogadoresSelecionados = jogadores.filter((j) => j.selecionado)

    if (jogadoresSelecionados.length < quantidadeTimes) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um jogador por time",
        variant: "destructive",
      })
      return
    }

    setIsGerando(true)

    try {
      const response = await fetch("/api/times/gerar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jogadoresIds: jogadoresSelecionados.map((j) => j.id),
          quantidadeTimes,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao gerar times")
      }

      const data = await response.json()
      setTimesGerados(data)
    } catch (error) {
      console.error("Erro ao gerar times:", error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar os times",
        variant: "destructive",
      })
    } finally {
      setIsGerando(false)
    }
  }

  const salvarTimes = async () => {
    setIsGerando(true)

    try {
      // Salvar os times gerados no banco de dados
      for (const time of timesGerados) {
        const response = await fetch("/api/times", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: time.nome,
            jogadoresIds: time.jogadores.map((j) => j.id),
          }),
        })

        if (!response.ok) {
          throw new Error(`Erro ao salvar o time ${time.nome}`)
        }
      }

      toast({
        title: "Sucesso",
        description: "Times salvos com sucesso",
      })

      router.push("/times")
    } catch (error) {
      console.error("Erro ao salvar times:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar os times",
        variant: "destructive",
      })
    } finally {
      setIsGerando(false)
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
        <Link href="/times" className="flex items-center text-green-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-xl font-bold text-green-800">Gerar Times</h1>
        <div className="w-6"></div> {/* Espaçador para centralizar o título */}
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade de Times</Label>
              <Input
                id="quantidade"
                type="number"
                min={2}
                max={4}
                value={quantidadeTimes}
                onChange={(e) => setQuantidadeTimes(Number.parseInt(e.target.value))}
                disabled={isGerando}
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Selecione os Jogadores</h3>
              {jogadores.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Nenhum jogador cadastrado. Adicione jogadores primeiro!
                </div>
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
              onClick={gerarTimes}
              className="w-full bg-green-700 hover:bg-green-800"
              disabled={jogadores.filter((j) => j.selecionado).length < quantidadeTimes || isGerando}
            >
              {isGerando ? (
                "Gerando..."
              ) : (
                <>
                  <Shuffle className="mr-2 h-4 w-4" /> Gerar Times
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {timesGerados.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Times Gerados</h2>

          {timesGerados.map((time, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">{time.nome}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{time.jogadores.length} jogadores</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-2">Média: {time.mediaAvaliacao.toFixed(1)} estrelas</div>

                <div className="grid grid-cols-2 gap-2">
                  {time.jogadores.map((jogador) => (
                    <div key={jogador.id} className="text-sm">
                      {jogador.nome} ({jogador.avaliacao})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center">
            <Button className="bg-green-700 hover:bg-green-800" onClick={salvarTimes} disabled={isGerando}>
              {isGerando ? "Salvando..." : "Salvar Times"}
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}

