import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-green-800 to-green-950">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-6">Gerenciador de Futebol</h1>
        <div className="space-y-4">
          <p className="text-center text-gray-600">Organize seus jogos, avalie jogadores e monte times equilibrados.</p>
          <div className="flex flex-col gap-3">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-green-700 hover:bg-green-800">Entrar</Button>
            </Link>
            <Link href="/cadastro" className="w-full">
              <Button variant="outline" className="w-full border-green-700 text-green-700 hover:bg-green-50">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

