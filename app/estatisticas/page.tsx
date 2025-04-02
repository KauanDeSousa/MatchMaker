import Link from "next/link"
import { ArrowLeft, Award, Flag, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Estatisticas() {
  // Dados de exemplo - seriam carregados do banco de dados
  const estatisticasJogadores = [
    { id: 1, nome: "Carlos Silva", gols: 5, assistencias: 2, cartaoAmarelo: 1, cartaoVermelho: 0, jogos: 3 },
    { id: 2, nome: "Rafael Oliveira", gols: 2, assistencias: 4, cartaoAmarelo: 2, cartaoVermelho: 0, jogos: 3 },
    { id: 3, nome: "Bruno Santos", gols: 0, assistencias: 0, cartaoAmarelo: 0, cartaoVermelho: 0, jogos: 3 },
    { id: 4, nome: "André Pereira", gols: 1, assistencias: 1, cartaoAmarelo: 3, cartaoVermelho: 1, jogos: 3 },
    { id: 5, nome: "Lucas Mendes", gols: 3, assistencias: 1, cartaoAmarelo: 0, cartaoVermelho: 0, jogos: 3 },
  ]

  const estatisticasTimes = [
    { id: 1, nome: "Time A", vitorias: 2, empates: 1, derrotas: 0, golsMarcados: 7, golsSofridos: 3 },
    { id: 2, nome: "Time B", vitorias: 1, empates: 1, derrotas: 1, golsMarcados: 5, golsSofridos: 4 },
    { id: 3, nome: "Time C", vitorias: 0, empates: 2, derrotas: 1, golsMarcados: 3, golsSofridos: 5 },
    { id: 4, nome: "Time D", vitorias: 0, empates: 0, derrotas: 1, golsMarcados: 1, golsSofridos: 4 },
  ]

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="flex items-center text-green-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-xl font-bold text-green-800">Estatísticas</h1>
        <div className="w-6"></div> {/* Espaçador para centralizar o título */}
      </div>

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
    </main>
  )
}

