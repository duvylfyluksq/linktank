"use client";

// import { SignIn} from '@clerk/nextjs'
import Image from "next/image";
import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';

export default function SignInPage() {
  // return <SignIn routing="path" path="/sign-in" />;
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#D1E7FD]">
      <div className="grid w-full flex-grow items-center px-4 justify-center pt-20">
        <SignIn.Root>
          <SignIn.Step
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
            <Clerk.GlobalError className="block text-sm text-red-400" />
            <div className="flex-row flex-grow items-center space-y-4 justify-center">
              <Clerk.Field name="emailAddress">
                <Clerk.Label className="text-sm font-medium text-zinc-950">Email</Clerk.Label>
                <Clerk.Input
                  type="email"
                  className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
              <SignIn.Strategy name="password">
                <Clerk.Field name="password">
                  <Clerk.Label className="text-sm  font-medium text-zinc-950">Password</Clerk.Label>
                  <Clerk.Input
                    type="password"
                    className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                  />
                  <Clerk.FieldError className="block text-sm text-red-400" />
                </Clerk.Field>
              </SignIn.Strategy>
              <SignIn.Action 
                navigate="forgot-password"
                className="underline underline-offset-4"
              >
                Forgot password?
              </SignIn.Action>
            </div>
            <SignIn.Action
              submit
              className="w-full rounded-md bg-[#1C2329] px-3 py-3 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
            >
              Sign In
            </SignIn.Action>
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
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
  // return (
  //   <div className="relative min-h-screen w-full overflow-hidden bg-[#D1E7FD]">
  //     <div className="grid w-full flex-grow items-center px-4 justify-center pt-20">
  //       <SignIn.Root>
  //         <SignIn.Step
  //           name="start"
  //           className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:px-8"
  //         >
  //           <div className="flex items-center justify-center">
  //             <Image
  //                 src="/linktank_logo.png"
  //                 alt="Linktank"
  //                 width={100}
  //                 height={100}
  //                 className="w-10 h-10 mr-[0.625rem] rounded-full"
  //             />
  //             <span className="text-2xl font-bold">Linktank</span>
  //           </div>
  //           <Clerk.GlobalError className="block text-sm text-red-400" />
  //           <div className="flex-row flex-grow items-center space-y-4 justify-center">
  //             <Clerk.Field name="emailAddress">
  //               <Clerk.Label className="text-sm font-medium text-zinc-950">Email</Clerk.Label>
  //               <Clerk.Input
  //                 type="email"
  //                 className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
  //               />
  //               <Clerk.FieldError className="block text-sm text-red-400" />
  //             </Clerk.Field>
  //           </div>
  //           <SignIn.Action
  //             submit
  //             className="w-full rounded-md bg-[#1C2329] px-3 py-3 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
  //           >
  //             Continue
  //           </SignIn.Action>
  //           <div className="flex gap-2 w-full">
  //             <Clerk.Connection name="google" className="flex-1">
  //               <div className="flex items-center justify-center gap-2 rounded-[9px] border-[1.23px] border-[#CBD5E1] px-4 py-2 whitespace-nowrap flex-grow">
  //                 <Clerk.Icon/>
  //                 <span>Continue with Google</span>
  //               </div>
  //             </Clerk.Connection>
  //             <Clerk.Connection name="apple" className="flex-1">
  //               <div className="flex items-center justify-center gap-2 rounded-[9px] border-[1.23px] border-[#CBD5E1] px-4 py-2 whitespace-nowrap flex-grow">
  //                   <Clerk.Icon/>
  //                   <span>Continue with Apple</span>
  //               </div>
  //             </Clerk.Connection>
  //           </div>
  //         </SignIn.Step>
  //         <SignIn.Step
  //           name="verifications"
  //           className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:px-8"
  //         >
  //           <div className="flex items-center justify-center">
  //             <Image
  //                 src="/linktank_logo.png"
  //                 alt="Linktank"
  //                 width={100}
  //                 height={100}
  //                 className="w-10 h-10 mr-[0.625rem] rounded-full"
  //             />
  //             <span className="text-2xl font-bold">Linktank</span>
  //           </div>
  //           <Clerk.GlobalError className="block text-sm text-red-400" />
  //           <SignIn.Strategy name="password">
  //             <div className="flex-row flex-grow items-center space-y-4 justify-center">
  //               <div>
  //                 <Clerk.Field name="password">
  //                   <Clerk.Label className="text-sm  font-medium text-zinc-950">Password</Clerk.Label>
  //                   <Clerk.Input
  //                     type="password"
  //                     className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
  //                   />
  //                   <Clerk.FieldError className="block text-sm text-red-400" />
  //                 </Clerk.Field>
  //                 <SignIn.Action 
  //                   navigate="forgot-password"
  //                   className="underline underline-offset-4"
  //                 >
  //                   Forgot password?
  //                 </SignIn.Action>
  //               </div>
  //             </div>
  //             <SignIn.Action
  //               submit
  //               className="w-full rounded-md bg-[#1C2329] px-3 py-3 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
  //             >
  //               Sign In
  //             </SignIn.Action>
  //           </SignIn.Strategy>
  //         </SignIn.Step>
  //       </SignIn.Root>
  //     </div>
  //   </div>
  // );
}