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
import { PasswordInput } from "@/components/PasswordInput"
import AuthLoadingScreen from "../../AuthLoadingScreen"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [allowAccess, setAllowAccess] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [authComplete, setAuthComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isLoaded, signIn, setActive } = useSignIn()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
      const visited = sessionStorage.getItem("visitedForgotPassword");
      if (!visited) {
        router.replace("/sign-in");
      } else {
        setAllowAccess(true);
      }
  }, []);
  
  if (!allowAccess) return null;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const result = await signIn?.resetPassword({
        password,
      })

      if (result?.status === "complete") {
        setAuthComplete(true)
        await setActive({ session: result.createdSessionId })
        toast({
          title: "Success",
          description: "Your password has been reset successfully",
        })
        router.push("/") // Redirect to home or dashboard
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
        description: "Failed to reset password. Please try again.",
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
              <h2 className="text-xl font-semibold">Create new password</h2>
              <p className="text-sm text-muted-foreground mt-1">Your password must be at least 8 characters long</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                  <Label htmlFor="password">
                      New Password<span className="text-red-500">*</span>
                  </Label>
                  <PasswordInput
                      id="password"
                      value={password}
                      placeholder="Enter new password"
                      onChange={(e) => setPassword(e.target.value)}
                  />
              </div>

              <div>
                  <Label htmlFor="confirmPassword">
                      Confirm Password<span className="text-red-500">*</span>
                  </Label>
                  <PasswordInput
                      id="confirmPassword"
                      value={confirmPassword}
                      placeholder="Confirm new password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                  />
              </div>

              <div className="py-4">
                  <Button
                      type="submit"
                      disabled={loading || !password || !confirmPassword}
                      className="w-full h-10 flex justify-center items-center bg-[#1C2329] hover:bg-[#0e3b69] text-white"
                  >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset password"}
                  </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
