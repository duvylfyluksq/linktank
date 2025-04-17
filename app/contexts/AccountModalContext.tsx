// app/context/AccountModalContext.tsx
"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type AccountTab = "profile" | "billing"

interface AccountModalContextType {
  open: boolean
  setOpen: (open: boolean) => void
  tab: AccountTab
  setTab: (tab: AccountTab) => void
  openWithTab: (tab: AccountTab) => void
}

const AccountModalContext = createContext<AccountModalContextType | undefined>(undefined)

export function AccountModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<AccountTab>("profile")

  const openWithTab = (tab: AccountTab) => {
    setTab(tab)
    setOpen(true)
  }

  return (
    <AccountModalContext.Provider value={{ open, setOpen, tab, setTab, openWithTab }}>
      {children}
    </AccountModalContext.Provider>
  )
}

export function useAccountModal() {
  const context = useContext(AccountModalContext)
  if (!context) throw new Error("useAccountModal must be used within AccountModalProvider")
  return context
}
