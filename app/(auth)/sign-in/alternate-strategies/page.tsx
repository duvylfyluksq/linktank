"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import Image from "next/image"
import AuthTabs from "@/components/AuthTabs"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
// import { FaApple } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import VerficationCode from "../../VerificationCode"
import AuthLoadingScreen from "../../AuthLoadingScreen"

export default function AlternateStrategiesPage() {
  const [loading, setLoading] = useState(false)
  const [allowAccess, setAllowAccess] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [authComplete, setAuthComplete] = useState(false)
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
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

  const handleSocialSignIn = async (provider: "oauth_google" | "oauth_apple") => {
    if (!isLoaded) return

    try {
      setSocialLoading(provider)

      await signIn?.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sign-in/sso-callback",
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

  const handleSendEmailCode = async () => {
    if (!isLoaded || !signIn?.identifier) return

    setLoading(true)

    try {

      const emailAddressId = signIn?.supportedFirstFactors?.find(
        (factor) => factor.strategy === "reset_password_email_code"
      )?.emailAddressId as string;

      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailAddressId
      })

      setEmailCodeSent(true)
      toast({
        title: "Code sent",
        description: "A verification code has been sent to your email",
      })
    } catch{
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmailCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "email_code",
        code: verificationCode,
      })

      if (result?.status === "complete") {
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
        description: "Invalid verification code. Please try again.",
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
            {!emailCodeSent &&
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mt-1">
                  {signIn?.identifier ? `Continue as ${signIn.identifier}` : "Choose a sign-in method"}
                </p>
              </div>
            }

            {emailCodeSent ? (
              <form onSubmit={handleVerifyEmailCode} className="space-y-4">

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-center">Verify your email</h2>
                  <p className="text-sm text-center text-muted-foreground">
                    We&apos;ve sent a verification code to your email address
                  </p>
                </div>

                <VerficationCode
                  verificationCode={verificationCode}
                  setVerificationCode={setVerificationCode}
                />

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-[#1C2329] hover:text-[#0e3b69]"
                    onClick={handleSendEmailCode}
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
            ) : (
              <div className="space-y-4">
                <Button
                  type="button"
                  onClick={handleSendEmailCode}
                  disabled={loading}
                  className="w-full h-10 flex justify-center items-center bg-[#1C2329] hover:bg-[#0e3b69] text-white"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Email verification code"}
                </Button>

                <div className="flex gap-2 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 flex justify-center items-center gap-2"
                    onClick={() => handleSocialSignIn("oauth_google")}
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

                  {/* <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 flex justify-center items-center gap-2"
                    onClick={() => handleSocialSignIn("oauth_apple")}
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
                  </Button> */}
                </div>

                <div className="text-center pt-2">
                  <Link href="/sign-in" className="text-sm text-[#1C2329] hover:text-[#0e3b69] hover:underline">
                    Back to sign in
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
