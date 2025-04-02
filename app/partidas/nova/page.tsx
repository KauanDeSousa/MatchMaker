"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function NovaPartida() {
  const [timeA, setTimeA] = useState("")
  const [timeB, setTimeB] = useState("")

  // Dados de exemplo - seriam carregados do banco de dados
  const times = [
    { id: "1", nome: "Time A" },
    { id: "2", nome: "Time B" },
    { id: "3", nome: "Time C" },
    { id: "4", nome: "Time D" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementação futura para iniciar partida
    console.log("Iniciar partida:", { timeA, timeB })
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/partidas" className="flex items-center text-green-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-xl font-bold text-green-800">Nova Partida</h1>
        <div className="w-6"></div> {/* Espaçador para centralizar o título */}
      </div>

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timeA">Time A</Label>
              <Select value={timeA} onValueChange={setTimeA} required>
                <SelectTrigger id="timeA">
                  <SelectValue placeholder="Selecione o time" />
                </SelectTrigger>
                <SelectContent>
                  {times.map((time) => (
                    <SelectItem key={time.id} value={time.id}>
                      {time.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeB">Time B</Label>
              <Select value={timeB} onValueChange={setTimeB} required>
                <SelectTrigger id="timeB">
                  <SelectValue placeholder="Selecione o time" />
                </SelectTrigger>
                <SelectContent>
                  {times.map((time) => (
                    <SelectItem key={time.id} value={time.id} disabled={time.id === timeA}>
                      {time.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800"
              disabled={!timeA || !timeB || timeA === timeB}
            >
              <Play className="mr-2 h-4 w-4" /> Iniciar Partida
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

