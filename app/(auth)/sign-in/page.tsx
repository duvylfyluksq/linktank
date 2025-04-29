"use client";

import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import Image from "next/image";
import AuthTabs from "@/components/AuthTabs";
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
// import { FaApple } from "react-icons/fa"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const { isLoaded, signIn } = useSignIn()
  const { toast } = useToast()
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signIn!.create({ identifier: email });
      const hasPassword = response!.supportedFirstFactors!.some(
        (factor: any) => factor.strategy === "password"
      );

      sessionStorage.setItem("visitedSignIn", "true");

      if (hasPassword) {
        router.push("/sign-in/password");
      } else {
        router.push("/sign-in/alternate-strategies");
      }

    } catch {
      toast({
        title: "Error",
        description: "No account found with this email",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  };


  const handleSocialSignIn = async (provider: "oauth_google" | "oauth_apple") => {
    if (!isLoaded) return

    try {
      setSocialLoading(provider)

      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/",
      })
    } catch {
      toast({
        title: "Authentication failed",
        description: "Failed to authenticate with provider. Please try again.",
        variant: "destructive",
      })
      setSocialLoading(null)
    }
  }

  return (
    <div className="w-full sm:w-[30rem] py-10 flex justify-center px-4">
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

          <form onSubmit={handleSignIn} className="space-y-4">
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
        </div>
      </div>
    </div>
  )
}