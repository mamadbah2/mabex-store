"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('authToken', data.token)
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        window.location.href = "/"
      } else {
        setError(data.error || "Erreur de connexion")
      }
    } catch (error) {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthClick = () => {
    toast({
      title: "Bientôt disponible",
      description: "La connexion via les réseaux sociaux sera disponible prochainement.",
    })
  }

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoratif */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border p-8 md:p-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Bon retour</h1>
          <p className="text-muted-foreground">Entrez vos identifiants pour accéder à votre compte.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nom@exemple.com"
                className="pl-10 py-3 rounded-xl bg-muted/50 border-border focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">Mot de passe</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="pl-10 pr-10 py-3 rounded-xl bg-muted/50 border-border focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <Label htmlFor="remember-me" className="text-sm text-muted-foreground font-normal cursor-pointer">
                Se souvenir de moi
              </Label>
            </div>
            <span className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
              Mot de passe oublié ?
            </span>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full py-3 rounded-xl shadow-lg shadow-primary/30 text-base font-bold"
            disabled={loading}
          >
            {loading ? "Connexion..." : (
              <span className="flex items-center justify-center gap-2">
                Se connecter <LogIn className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-card text-muted-foreground font-medium">Ou continuer avec</span>
          </div>
        </div>

        {/* OAuth */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleOAuthClick}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.12-3.293 2.14-2.16 2.8-5.64 2.8-8.547 0-.747-.067-1.48-.187-2.187h-10.74z" />
            </svg>
            <span className="text-sm font-semibold">Google</span>
          </button>
          <button
            type="button"
            onClick={handleOAuthClick}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
              <path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold">Facebook</span>
          </button>
        </div>

        {/* Link to register */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-bold text-primary hover:text-primary/80 hover:underline transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
