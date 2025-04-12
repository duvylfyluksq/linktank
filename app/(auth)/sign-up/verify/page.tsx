"use client"

import type React from "react"

import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Image from "next/image"
import AuthTabs from "@/components/AuthTabs"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import VerficationCode from "../../VerificationCode"

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (isLoaded && !signUp.status) {
      router.push("/sign-up")
    }
  }, [isLoaded, signUp, router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      setResendDisabled(false)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)

    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      })

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId })
        toast({
          title: "Success",
          description: "Your account has been verified successfully",
        })
        router.push("/")
      } else {
        toast({
          title: "Verification incomplete",
          description: "Something went wrong. Please try again",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Verification failed",
        description: "Verification code is incorrect",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!isLoaded || resendDisabled) return

    try {
      setResendDisabled(true)
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setCountdown(30)
      toast({
        title: "Code sent",
        description: "A new verification code has been sent to your email",
      })
    } catch{
      toast({
        title: "Failed to send code",
        description: "Something went wrong. Please try again",
        variant: "destructive",
      })
      setResendDisabled(false)
    }
  }

  return (
    <div className="w-[30rem] py-10 flex justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        {/* Logo */}
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

        {/* Tabs */}
        <div className="px-6 mt-4">
          <AuthTabs />
        </div>

        <form onSubmit={handleVerify} className="px-6 mt-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-center">Verify your email</h2>
            <p className="text-sm text-center text-muted-foreground">
              We&apos;ve sent a verification code to your email address
            </p>
          </div>

          <div className="space-y-4">
            <VerficationCode
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
            />

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm text-[#1C2329] hover:text-[#0e3b69]"
                onClick={handleResendCode}
                disabled={resendDisabled}
              >
                {resendDisabled ? `Resend code in ${countdown}s` : "Didn't receive a code? Resend"}
              </Button>
            </div>
          </div>

          <div className="pb-6">
            <Button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full h-10 flex justify-center items-center bg-[#1C2329] hover:bg-[#0e3b69] text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
