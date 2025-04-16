"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";

interface AddPaymentMethodFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    isUpdate: boolean;
    setLoadingCard: (boolean) => void;
    existingPaymentMethodId?: string;
};

export function AddPaymentMethodForm({
    open,
    onOpenChange,
    onSuccess,
    isUpdate = false,
    setLoadingCard,
    existingPaymentMethodId,
}: AddPaymentMethodFormProps) {

    const { user } = useUser();
    const userId = user?.id as any;
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
      
        if (!stripe || !elements) return
      
        setIsLoading(true)
        setErrorMessage(null)
      
        try {
            setLoadingCard(true);
            if (isUpdate && existingPaymentMethodId) {
                const detachRes = await fetch(`/api/users/${userId}/payment_methods/${existingPaymentMethodId}`, {
                    method: "DELETE",
                })
        
                if (!detachRes.ok) {
                const { error } = await detachRes.json()
                throw new Error(error || "Failed to detach existing card")
                }
            }
      
            const result = await stripe.confirmSetup({
                elements,
                confirmParams: {
                return_url: `${window.location.origin}`,
                },
                redirect: "if_required",
            })
        
            if (result.error) {
                throw new Error(result.error.message || "Failed to confirm setup intent")
            }
      
            const setupIntent = result.setupIntent as any;
            const newPaymentMethodId = setupIntent.payment_method as string
        
            const setDefaultRes = await fetch(`/api/users/${userId}/payment_methods/${newPaymentMethodId}`, {
                method: "POST",
            })
        
            if (!setDefaultRes.ok) {
                const { error } = await setDefaultRes.json()
                throw new Error(error || "Failed to set new default payment method")
            }
        
            onSuccess()
        } catch (error: any) {
            console.error("Error adding/updating payment method:", error)
            setErrorMessage(error.message || "An unexpected error occurred")
        } finally {
            setIsLoading(false)
            onOpenChange(false)
        }
      }
      

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden><DialogTitle/></VisuallyHidden>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                </DialogHeader>
                <form onSubmit={handleSubmit}>      
                    <PaymentElement />

                    {errorMessage && (
                        <div className="mt-4 text-sm text-red-600">{errorMessage}</div>
                    )}

                    <div className="mt-6 flex w-full">
                        <Button
                            type="submit"
                            disabled={!stripe || !elements || isLoading}
                            className="w-full px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-[#113663] disabled:opacity-50"
                        >
                        {isLoading
                            ? "Processing..."
                            : isUpdate
                            ? "Update Payment Method"
                            : "Add Payment Method"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    ) 
}
