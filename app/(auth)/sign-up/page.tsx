"use client"

import type React from "react"

import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import AuthTabs from "@/components/AuthTabs"
import { PasswordInput } from "@/components/PasswordInput"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import {FaApple} from "react-icons/fa"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const { isLoaded, signUp } = useSignUp()
  const router = useRouter()
  const { toast } = useToast()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)

    if (!firstName || !lastName || !email || !password) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      })
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      sessionStorage.setItem("visitedSignUp", "true")
      router.push("/sign-up/verify")
    } catch (err: any) {
      const code = err.errors?.[0]?.code

      if (code === "form_identifier_exists") {
        toast({
          title: "Account exists",
          description: "An account with this email already exists",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignUp = async (provider: "oauth_google" | "oauth_apple") => {
    if (!isLoaded) return

    try {
      setSocialLoading(provider)
      
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "sign-in/sso-callback",
        redirectUrlComplete: "/",
      })
    } catch{
      toast({
        title: "Authentication failed",
        description: "Failed to authenticate with provider. Please try again.",
        variant: "destructive",
      })
      setSocialLoading(null)
    }
  }

  return (
    <div className="w-[30rem] py-10 flex justify-center px-4">
      <div className="py-4 w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="flex items-center justify-center px-6 pt-6">
          <Image
            src="/linktank_logo.png"
            alt="Linktank"
            width={100}
            height={100}
            className="w-10 h-10 mr-[0.625rem] rounded-full"
          />
          <span className="text-2xl font-bold">Linktank</span>
        </div>

        <div className="px-6 mt-4">
          <AuthTabs />
        </div>

        <div className="px-6 mt-6">

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="firstName">
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  className="w-full"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>

              <div className="w-1/2">
                <Label htmlFor="lastName">
                  Last Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  className="w-full"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password">
                Password<span className="text-red-500">*</span>
              </Label>
              <PasswordInput
                id="password"
                value={password}
                placeholder="Create a password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="py-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 flex justify-center items-center bg-[#1C2329] hover:bg-[#0e3b69] text-white"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs lowercase">
              <span className="bg-white px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4 w-full">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 flex justify-center items-center gap-2"
              onClick={() => handleSocialSignUp("oauth_google")}
              disabled={!!socialLoading}
            >
              {socialLoading === "oauth_google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <FcGoogle className="h-5 w-5" />
                  <span>Google</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 flex justify-center items-center gap-2"
              onClick={() => handleSocialSignUp("oauth_apple")}
              disabled={!!socialLoading}
            >
              {socialLoading === "oauth_apple" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <FaApple className="h-5 w-5" />
                  <span>Apple</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
