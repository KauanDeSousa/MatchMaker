"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Erro ao entrar",
          description: "Email ou senha incorretos",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Redirecionando para o dashboard...",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      toast({
        title: "Erro ao entrar",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col p-4 bg-gradient-to-b from-green-800 to-green-950">
      <Link href="/" className="text-white mb-6 flex items-center">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Link>

      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-6">Entrar</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-green-700 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

