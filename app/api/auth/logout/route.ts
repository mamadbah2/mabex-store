import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { cookies: resolveCookies } = await import("next/headers")
    const cookieStore = await resolveCookies()
    cookieStore.delete("authToken")
    
    return NextResponse.json({ message: "Déconnexion réussie" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 })
  }
}
