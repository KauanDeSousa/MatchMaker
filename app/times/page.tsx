import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Users } from "lucide-react"

export default function Times() {
  // Dados de exemplo - seriam carregados do banco de dados
  const times = [
    {
      id: 1,
      nome: "Time A",
      jogadores: [
        { id: 1, nome: "Carlos Silva", avaliacao: 4.5 },
        { id: 2, nome: "Rafael Oliveira", avaliacao: 3.5 },
        { id: 3, nome: "Bruno Santos", avaliacao: 5 },
        { id: 4, nome: "André Pereira", avaliacao: 4 },
        { id: 5, nome: "Lucas Mendes", avaliacao: 3 },
        { id: 6, nome: "Marcos Lima", avaliacao: 4 },
      ],
      mediaAvaliacao: 4.0,
    },
    {
      id: 2,
      nome: "Time B",
      jogadores: [
        { id: 7, nome: "Felipe Costa", avaliacao: 4 },
        { id: 8, nome: "Ricardo Souza", avaliacao: 3.5 },
        { id: 9, nome: "Gabriel Alves", avaliacao: 5 },
        { id: 10, nome: "Thiago Ferreira", avaliacao: 4.5 },
        { id: 11, nome: "Rodrigo Santos", avaliacao: 3 },
        { id: 12, nome: "Eduardo Oliveira", avaliacao: 4 },
      ],
      mediaAvaliacao: 4.0,
    },
  ]

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="flex items-center text-green-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-xl font-bold text-green-800">Times</h1>
        <div className="w-6"></div> {/* Espaçador para centralizar o título */}
      </div>

      <div className="mb-4">
        <Link href="/times/gerar">
          <Button className="w-full bg-green-700 hover:bg-green-800">Gerar Times Equilibrados</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {times.map((time) => (
          <Card key={time.id} className="hover:shadow-md transition-shadow">
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
      </div>
    </main>
  )
}

