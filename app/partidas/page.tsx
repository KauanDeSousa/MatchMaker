import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Partidas() {
  // Dados de exemplo - seriam carregados do banco de dados
  const partidas = [
    {
      id: 1,
      data: "01/04/2025",
      timeA: "Time A",
      timeB: "Time B",
      placarA: 3,
      placarB: 2,
      status: "finalizada",
    },
    {
      id: 2,
      data: "01/04/2025",
      timeA: "Time C",
      timeB: "Time D",
      placarA: 1,
      placarB: 1,
      status: "em_andamento",
    },
    {
      id: 3,
      data: "01/04/2025",
      timeA: "Time E",
      timeB: "Time F",
      placarA: 0,
      placarB: 0,
      status: "agendada",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "finalizada":
        return (
          <Badge variant="outline" className="bg-gray-100">
            Finalizada
          </Badge>
        )
      case "em_andamento":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Em andamento
          </Badge>
        )
      case "agendada":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Agendada
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "finalizada":
        return <Clock className="h-4 w-4" />
      case "em_andamento":
        return <Play className="h-4 w-4 text-green-700" />
      case "agendada":
        return <Pause className="h-4 w-4 text-blue-700" />
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="flex items-center text-green-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-xl font-bold text-green-800">Partidas</h1>
        <div className="w-6"></div> {/* Espaçador para centralizar o título */}
      </div>

      <div className="mb-4">
        <Link href="/partidas/nova">
          <Button className="w-full bg-green-700 hover:bg-green-800">Nova Partida</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {partidas.map((partida) => (
          <Link key={partida.id} href={`/partidas/${partida.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-500">{partida.data}</div>
                  {getStatusBadge(partida.status)}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">{partida.timeA}</div>
                  <div className="text-xl font-bold">
                    {partida.placarA} - {partida.placarB}
                  </div>
                  <div className="text-lg font-medium">{partida.timeB}</div>
                </div>

                <div className="flex justify-center mt-2">{getStatusIcon(partida.status)}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}

