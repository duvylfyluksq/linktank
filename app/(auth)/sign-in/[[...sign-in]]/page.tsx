"use client";

import { SignIn} from '@clerk/nextjs'
import { appearance } from '../../appearance';

// import { useState } from "react";
import Image from "next/image";
// import * as Clerk from '@clerk/elements/common';
// import * as SignIn from '@clerk/elements/sign-in';
// import { Eye, EyeOff } from "lucide-react";
import AuthTabs from "@/components/AuthTabs";

export default function SignInPage() {
  // const [showPassword, setShowPassword] = useState(false);
  return (
      <div className="py-10 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
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
    
          <div className="px-0 mt-2">
            <SignIn
              path="/sign-in"
              routing="path"
              appearance={appearance}
            />
          </div>
        </div>
      </div>
    );
  // return (
  //   <div className="relative min-h-screen w-full overflow-hidden bg-[#D1E7FD]">
  //     <div className="grid w-full flex-grow items-center px-4 justify-center pt-20">
  //       <SignIn.Root>
  //         <SignIn.Step
  //           name="start"
  //           className="w-[36rem] min-w-[20rem] space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:px-8"
  //         >
  //           <div className="flex items-center justify-center">
  //             <Image
  //                 src="/linktank_logo.png"
  //                 alt="Linktank"
  //                 width={100}
  //                 height={100}
  //                 className="w-10 h-10 mr-[0.625rem] rounded-full"
  //             />
  //             <span className="text-2xl font-bold text-[#282828]">Linktank</span>
  //           </div>
  //           <AuthTabs/>
  //           <Clerk.GlobalError className="block text-sm text-red-400" />
  //           <div className="flex-row flex-grow items-center space-y-4 justify-center">
  //             <Clerk.Field name="identifier">
  //               <Clerk.Label className="text-sm font-medium text-gray-700">Email<span className="text-red-500">*</span></Clerk.Label>
  //               <Clerk.Input
  //                 type="text"
  //                 required
  //                 placeholder="vedanta@techbrig.co"
  //                 className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
  //               />
  //               <Clerk.FieldError className="block text-sm text-red-400" />
  //             </Clerk.Field>
  //             <div className="space-y-2">
  //               <Clerk.Field name="password">
  //                 <Clerk.Label className="text-sm font-medium text-gray-700">
  //                   Password<span className="text-red-500">*</span>
  //                 </Clerk.Label>
  //                 <div className="relative">
  //                   <Clerk.Input
  //                     type={showPassword ? "text" : "password"}
  //                     required
  //                     placeholder="Enter your password"
  //                     className="w-full rounded-md bg-white px-3.5 py-2 pr-10 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
  //                   />
  //                   <button
  //                     type="button"
  //                     onClick={() => setShowPassword((prev) => !prev)}
  //                     className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900 focus:outline-none"
  //                   >
  //                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  //                   </button>
  //                 </div>
  //                 <Clerk.FieldError className="block text-sm text-red-400" />
  //               </Clerk.Field>
  //               <SignIn.Action 
  //                 navigate="forgot-password"
  //                 className="text-sm font-medium text-gray-700 underline underline-offset-4"
  //               >
  //                 Forgot password?
  //               </SignIn.Action>
  //             </div>
  //           </div>
  //           <SignIn.Action
  //             submit
  //             className="w-full rounded-md bg-[#1C2329] px-3 py-3 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
  //           >
  //             Sign In
  //           </SignIn.Action>
  //           <div className="flex gap-2 w-full">
  //             <Clerk.Connection name="google" className="flex-1">
  //               <div className="flex items-center justify-center gap-2 rounded-[9px] border-[1.23px] border-[#CBD5E1] px-4 py-2 whitespace-nowrap flex-grow">
  //                 <Clerk.Icon/>
  //                 <span className="text-gray-700">Continue with Google</span>
  //               </div>
  //             </Clerk.Connection>
  //             <Clerk.Connection name="apple" className="flex-1">
  //               <div className="flex items-center justify-center gap-2 rounded-[9px] border-[1.23px] border-[#CBD5E1] px-4 py-2 whitespace-nowrap flex-grow">
  //                   <Clerk.Icon/>
  //                   <span className="text-gray-700">Continue with Apple</span>
  //               </div>
  //             </Clerk.Connection>
  //           </div>
  //         </SignIn.Step>
  //       </SignIn.Root>
  //     </div>
  //   </div>
  // );
}