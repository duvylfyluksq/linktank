"use client";

import { SignIn} from '@clerk/nextjs'
import { appearance } from '../../appearance';

import Image from "next/image";
import AuthTabs from "@/components/AuthTabs";

export default function SignInPage() {
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
              appearance={{
                ...appearance,
                elements: {
                  ...appearance.elements,
                  formFieldRow__password: "hidden",
                },
              }}
            />
          </div>
        </div>
      </div>
    );
}