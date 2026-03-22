import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { login } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = loginSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 })
    }
    
    const { email, password } = result.data

    const session = await login(email, password)

    if (!session) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const { cookies: resolveCookies } = await import("next/headers")
    const cookieStore = await resolveCookies()
    cookieStore.set("authToken", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return NextResponse.json({
      message: "Connexion réussie",
      user: session.user,
      token: session.token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
