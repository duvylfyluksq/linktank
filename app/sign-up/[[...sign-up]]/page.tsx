"use client";

// import { SignUp} from '@clerk/nextjs'
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import AuthTabs from "../../../components/AuthTabs";

export default function SignUpPage() {
  // return <SignUp routing="path" path="/sign-up" />;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#D1E7FD]">
      <div className="grid w-full flex-grow items-center px-4 justify-center pt-20">
        <SignUp.Root>
          <SignUp.Step
            name="start"
            className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:px-8"
          >
            <div className="flex items-center justify-center">
              <Image
                  src="/linktank_logo.png"
                  alt="Linktank"
                  width={100}
                  height={100}
                  className="w-10 h-10 mr-[0.625rem] rounded-full"
              />
              <span className="text-2xl font-bold">Linktank</span>
            </div>
            <AuthTabs/>
            <Clerk.GlobalError className="block text-sm text-red-400" />
            <div className="flex-row flex-grow items-center space-y-4 justify-center">
              <div className="flex items-center gap-2">
                <Clerk.Field name="firstName">
                  <Clerk.Label className="text-sm font-medium text-zinc-950">First Name<span className="text-red-500">*</span></Clerk.Label>
                  <Clerk.Input
                    type="text"
                    className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                  />
                  <Clerk.FieldError className="block text-sm text-red-400" />
                </Clerk.Field>
                <Clerk.Field name="lastName">
                  <Clerk.Label className="text-sm font-medium text-zinc-950">Last Name<span className="text-red-500">*</span></Clerk.Label>
                  <Clerk.Input
                    type="text"
                    className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                  />
                  <Clerk.FieldError className="block text-sm text-red-400" />
                </Clerk.Field>
              </div>
              <Clerk.Field name="emailAddress">
                <Clerk.Label className="text-sm font-medium text-zinc-950">Email<span className="text-red-500">*</span></Clerk.Label>
                <Clerk.Input
                  type="email"
                  className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
              <Clerk.Field name="password">
                <Clerk.Label className="text-sm font-medium text-zinc-950">
                  Password<span className="text-red-500">*</span>
                </Clerk.Label>
                <div className="relative">
                  <Clerk.Input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full rounded-md bg-white px-3.5 py-2 pr-10 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
            </div>
            <SignUp.Action
              submit
              className="w-full rounded-md bg-[#1C2329] px-3 py-3 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
            >
              Sign Up
            </SignUp.Action>
            <div className="flex gap-2 w-full">
              <Clerk.Connection name="google" className="flex-1">
                <div className="flex items-center justify-center gap-2 rounded-[9px] border-[1.23px] border-[#CBD5E1] px-4 py-2 whitespace-nowrap flex-grow">
                  <Clerk.Icon/>
                  <span>Continue with Google</span>
                </div>
              </Clerk.Connection>
              <Clerk.Connection name="apple" className="flex-1">
                <div className="flex items-center justify-center gap-2 rounded-[9px] border-[1.23px] border-[#CBD5E1] px-4 py-2 whitespace-nowrap flex-grow">
                    <Clerk.Icon/>
                    <span>Continue with Apple</span>
                </div>
              </Clerk.Connection>
            </div>
          </SignUp.Step>
          <SignUp.Step 
            name="verifications"
            className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:px-8"
          >
            <div className="flex items-center justify-center">
              <Image
                  src="/linktank_logo.png"
                  alt="Linktank"
                  width={100}
                  height={100}
                  className="w-10 h-10 mr-[0.625rem] rounded-full"
              />
              <span className="text-2xl font-bold">Linktank</span>
            </div>
            <Clerk.GlobalError className="block text-sm text-red-400" />
            <div className="flex-row flex-grow items-center space-y-4 justify-center">
              <SignUp.Strategy name="email_code">
                <h1>Check your email</h1>

                <Clerk.Field name="code">
                  <Clerk.Label>Email Code</Clerk.Label>
                  <Clerk.Input />
                  <Clerk.FieldError />
                </Clerk.Field>

                <SignUp.Action submit>Verify</SignUp.Action>
              </SignUp.Strategy>
            </div>
        </SignUp.Step>
        </SignUp.Root>
      </div>
    </div>
  );
}