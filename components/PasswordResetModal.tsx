"use client"
import type React from "react"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "./PasswordInput"

interface PasswordResetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PasswordResetModal({
    open,
    onOpenChange
  }: PasswordResetProps) {

    const [loading, setLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const { toast } = useToast()
    const { user } = useUser()
  
    const resetPassword = async (e: React.FormEvent) => {
      e.preventDefault()
  
      if (newPassword !== confirmPassword) {
        setError("New passwords don't match")
        return
      }
  
      setLoading(true)
      setError("")
  
      try {
        await user?.updatePassword({
          currentPassword,
          newPassword,
        })
  
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated.",
        })
  
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onOpenChange(false);

      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to update password")
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Update your password to secure your account.</DialogDescription>
          </DialogHeader>
          <form onSubmit={resetPassword} className="space-y-4 pt-4">
            <div className="space-y-1">
              <Label htmlFor="current-password">Current Password</Label>
              <PasswordInput
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-password">New Password</Label>
              <PasswordInput
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <PasswordInput
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 flex justify-center items-center hover:bg-[#0e3b69]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }