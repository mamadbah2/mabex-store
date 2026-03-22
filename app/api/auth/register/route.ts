import { type NextRequest, NextResponse } from "next/server"
import { User } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import bcrypt from 'bcryptjs'
import { login } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: z.string().min(2, "Le prénom est requis (min 2 caractères)"),
  lastName: z.string().min(2, "Le nom est requis (min 2 caractères)"),
  phone: z.string().optional(),
  address: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 })
    }

    const { email, password, firstName, lastName, phone, address } = result.data

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "Un compte avec cet email existe déjà" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user (default role is customer)
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      role: "customer",
      phone,
      address,
      isActive: true,
    })

    // Auto-login after registration using the login function
    const session = await login(email, password)
    
    if (!session) {
      return NextResponse.json({ error: "Erreur lors de la connexion automatique" }, { status: 500 })
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
      message: "Compte créé avec succès",
      user: session.user,
      token: session.token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
