"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import Image from "next/image"
import AuthTabs from "@/components/AuthTabs"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import VerficationCode from "../../VerificationCode"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [allowAccess, setAllowAccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const { isLoaded, signIn } = useSignIn()
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

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)

    try {
      const response = await signIn?.create({
        identifier: email,
      })

      const emailAddressId = response?.supportedFirstFactors?.find(
        (factor) => factor.strategy === "reset_password_email_code"
      )?.emailAddressId as string;

      await signIn?.prepareFirstFactor({
        strategy: "reset_password_email_code",
        emailAddressId: emailAddressId
      })

      setCodeSent(true)
      toast({
        title: "Code sent",
        description: "A verification code has been sent to your email",
      })
    } catch {
      toast({
        title: "Error",
        description: "Email address doesn't match",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: verificationCode,
      })

      if (result?.status === "needs_new_password") {
        sessionStorage.setItem("visitedForgotPassword", "true");
        router.push("/sign-in/reset-password")
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
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold">Reset your password</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {codeSent
                ? "Enter the verification code sent to your email"
                : "We'll send a verification code to your email"}
            </p>
          </div>

          {!codeSent ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
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
                  autoFocus
                />
              </div>

              <div className="py-4">
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-10 flex justify-center items-center bg-[#1C2329] hover:bg-[#0e3b69] text-white"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send verification code"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <VerficationCode
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
              />
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-[#1C2329] hover:text-[#0e3b69]"
                  onClick={handleRequestCode}
                  disabled={loading}
                >
                  Didn&apos;t receive a code? Send again
                </Button>
              </div>

              <div className="py-4">
                <Button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full h-10 flex justify-center items-center bg-[#1C2329] hover:bg-[#0e3b69] text-white"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
