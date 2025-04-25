"use client";

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import AuthLoadingScreen from "../../AuthLoadingScreen";

export default function SSOCallbackPage() {
  return (
    <>
      <AuthLoadingScreen type="signin"/>
      <AuthenticateWithRedirectCallback/>
    </>
  );
}
