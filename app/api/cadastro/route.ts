import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { nome, email, senha } = await req.json()

    // Verificar se o email já está em uso
    const existingUser = await prisma.usuario.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email já está em uso" }, { status: 400 })
    }

    // Hash da senha
    const hashedPassword = await hash(senha, 10)

    // Criar o usuário
    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
      },
    })

    return NextResponse.json(
      {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

