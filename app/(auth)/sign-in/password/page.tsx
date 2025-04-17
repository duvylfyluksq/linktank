"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import Image from "next/image"
import AuthTabs from "@/components/AuthTabs"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { PasswordInput } from "@/components/PasswordInput"
import AuthLoadingScreen from "../../AuthLoadingScreen"

export default function PasswordSignInPage() {
  const [password, setPassword] = useState("")
  const [allowAccess, setAllowAccess] = useState(false)
  const [authComplete, setAuthComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isLoaded, signIn, setActive } = useSignIn()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const visited = sessionStorage.getItem("visitedSignIn");
    if (!visited) {
      router.replace("/sign-in");
    } else {
      setAllowAccess(true);
    }
  }, []);

  if (!allowAccess) return null;

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signIn?.identifier) return

    setLoading(true)

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "password",
        password,
      })

      if (result.status === "complete") {
        setAuthComplete(true)
        await setActive({ session: result.createdSessionId })
        toast({
          title: "Success",
          description: "You have been signed in successfully",
        })
        router.push("/")
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch{
      toast({
        title: "Error",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {authComplete && <AuthLoadingScreen type="signin" />}
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
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mt-1">
                {signIn?.identifier ? `Continue as ${signIn.identifier}` : "Please enter your password"}
              </p>
            </div>

            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div>
                  <Label htmlFor="password">
                      Password<span className="text-red-500">*</span>
                  </Label>
                  <PasswordInput
                      id="password"
                      value={password}
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                  />
              </div>

              <div className="flex justify-between items-center text-sm">
                <Link href="/sign-in/forgot-password" className="text-[#1C2329] hover:text-[#0e3b69] hover:underline">
                  Forgot password?
                </Link>
                <Link
                  href="/sign-in/alternate-strategies"
                  className="text-[#1C2329] hover:text-[#0e3b69] hover:underline"
                >
                  Try another method
                </Link>
              </div>

              <div className="py-4">
                <Button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full h-10 flex justify-center items-center bg-[#1C2329] hover:bg-[#0e3b69] text-white"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
