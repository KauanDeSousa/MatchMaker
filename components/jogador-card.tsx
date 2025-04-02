import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Link from "next/link"

interface Jogador {
  id: number
  nome: string
  avaliacao: number
  posicao: string
}

interface JogadorCardProps {
  jogador: Jogador
}

export default function JogadorCard({ jogador }: JogadorCardProps) {
  // Função para renderizar as estrelas
  const renderEstrelas = (avaliacao: number) => {
    const estrelas = []
    const estrelasInteiras = Math.floor(avaliacao)
    const temMeiaEstrela = avaliacao % 1 >= 0.5

    // Estrelas cheias
    for (let i = 0; i < estrelasInteiras; i++) {
      estrelas.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    // Meia estrela
    if (temMeiaEstrela) {
      estrelas.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      )
    }

    // Estrelas vazias
    const estrelasVazias = 5 - Math.ceil(avaliacao)
    for (let i = 0; i < estrelasVazias; i++) {
      estrelas.push(<Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />)
    }

    return estrelas
  }

  return (
    <Link href={`/jogadores/${jogador.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{jogador.nome}</h3>
              <p className="text-sm text-gray-500">{jogador.posicao}</p>
            </div>
            <div className="flex">{renderEstrelas(jogador.avaliacao)}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

