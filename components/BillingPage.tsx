"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { AddPaymentMethodForm } from "./AddPaymentMethodForm"
import { DownloadIcon, CreditCardIcon, AlertCircleIcon, Loader2, Edit2, Trash2 } from "lucide-react"
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast"
import { Button } from "./ui/button"
import ConfirmDialog from "./ConfirmDialog"
import { Skeleton } from "./ui/skeleton"
import { useBillingInfo } from "@/app/contexts/BillingContext"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function BillingPage() {
    const { user } = useUser();
    const userId = user?.id as any;
    const router = useRouter();
    const {
        hasSubscription,
        hasPaymentMethod,
        activeSubscription,
        isMonthlyPlan,
        isYearlyPlan,
        selectedPlan,
        setSelectedPlan,
        renewalDate,
        customerData,
        updateCustomerData,
        loadingPlan,
        updateLoadingPlan,
        loadingCard,
        updateLoadingCard
      } = useBillingInfo();      
    const [cardFormOpen, setCardFormOpen] = useState(false);
    const [updateCard, setUpdateCard] = useState(false);
    const [setupIntent, setSetupIntent] = useState<string | null>(null);
    const [updatingPlan, setUpdatingPlan] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { toast } = useToast();

    const handleUpdateBillingCycle = async () => {
        if (!activeSubscription) return
        if (!hasPaymentMethod){
            toast({
                title: "Error",
                description: `Please add a card before switching plans`,
                variant: "destructive"
            })
            return;
        }
    
        try {
          setUpdatingPlan(true)
          updateLoadingPlan(true)
          const newPriceId =
            selectedPlan === "monthly"
              ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
              : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!
    

            await fetch(`/api/users/${userId}/subscriptions`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ subscriptionId: activeSubscription, newPriceId: newPriceId })
            });
    
          toast({
            title: "Success",
            description: `Your subscription has been updated to the ${selectedPlan} plan. You'll see the prorated charges on your next invoice.`,
          })
    
            const response = await fetch(`/api/users/${userId}/stripe_data`);
            const result = await response.json();
            updateCustomerData(result.data);
        } catch (error) {
          console.error("Error updating billing cycle:", error)
          toast({
            title: "Error",
            description: "Failed to update your billing cycle. Please try again.",
            variant: "destructive",
          })
        } finally {
          setUpdatingPlan(false)
          updateLoadingPlan(false)
        }
      }

    const handleSubscribe = async (priceId: string) => {
        try {
            const res = await fetch(`/api/users/${userId}/create_checkout_session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ price_id: priceId }),
              });
            const result = await res.json();
            if (result?.url) router.push(result.url);
            const response = await fetch(`/api/users/${userId}/stripe_data`);
            const stripeDataResult = await response.json();
            updateCustomerData(stripeDataResult.data);
        } catch (error) {
            console.error("Error creating checkout session:", error)
        } finally {
            updateLoadingPlan(false)
        }
    }

    const handleCancelSubscription = async () => {
        if (!activeSubscription) return;
        try {
            updateLoadingPlan(true)
            await fetch(`/api/users/${userId}/subscriptions`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ subscriptionId: activeSubscription })
            });
            const response = await fetch(`/api/users/${userId}/stripe_data`);
            const result = await response.json();
            updateCustomerData(result.data);
        } catch (error) {
            console.error("Error canceling subscription:", error)
        } finally {
            updateLoadingPlan(false)
            setConfirmOpen(false);
        }
    }

    const handleDeleteCard = async () => {
        const defaultPaymentMethodId = customerData.paymentMethods[0].id
      
        if (!defaultPaymentMethodId || !userId) {
          console.error("Missing userId or payment method ID.");
          return;
        }
      
      
        try {
            updateLoadingCard(true)
            await fetch(`/api/users/${userId}/payment_methods/${defaultPaymentMethodId}`, {
                method: "DELETE",
            });
      
            const response = await fetch(`/api/users/${userId}/stripe_data`);
            const result = await response.json();
            updateCustomerData(result.data);
      
            toast({
                title: "Success",
                description: "Card deleted successfully",
            })
        } catch{
            toast({
                title: "Error",
                description: "There was an error in deleting the card",
                variant: "destructive"
            })
        } finally{
            updateLoadingCard(false)
        }
    };

    const handleCardOpen = async (isUpdate : boolean) => {
        try {
            const response = await fetch(`/api/users/${userId}/create_setup_intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              });
            const data = await response.json();
            const clientSecret = data.clientSecret;
            setSetupIntent(clientSecret)
            setCardFormOpen(true)
            setUpdateCard(isUpdate)
        } catch (error) {
            console.error("Error creating setup intent:", error)
        }
    }
      
    const handleCardSuccess = async () => {
        toast({
            title: "Success",
            description: "Card saved successfully",
        })
        const response = await fetch(`/api/users/${userId}/stripe_data`);
        const result = await response.json();
        updateCustomerData(result.data);
        updateLoadingCard(false)
    }
    

    return (
        <div className="p-6 space-y-6">
            {/* Subscription Plan */}
            <div className="border rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-medium">{hasSubscription ? "Subscription Plan" : "Select a plan"}</h3>
                <p className="text-sm text-gray-500">
                    {hasSubscription ? "Your current plan and billing cycle" : "Subscribe to access Linktank fully!"}
                </p>

                <div className="flex flex-col gap-3">
                {loadingPlan ? (
                    <>
                    <div className="flex px-4 py-4 items-center gap-2 rounded-xl border border-inherit animate-pulse">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <div className="flex justify-between items-center w-full">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <div className="flex px-4 py-4 items-center gap-2 rounded-xl border border-inherit animate-pulse">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        </div>
                    </div>
                    </>
                ) :
                hasSubscription ? (
                    <>
                    <div className="flex-1 flex px-4 py-4 items-center gap-2 rounded-xl border border-inherit">
                        <input
                            type="radio"
                            id="monthly"
                            name="plan"
                            checked={selectedPlan === "monthly"}
                            onChange={() => setSelectedPlan("monthly")}
                            className="h-4 w-4 text-blue-600 cursor-pointer"
                        />
                        <label htmlFor="monthly" className="flex justify-between items-center w-full">
                            <span>Monthly</span>
                            <span>$9.99/month</span>
                        </label>
                    </div>
                    <div className="flex-1 flex px-4 py-4 items-center gap-2 rounded-xl border border-inherit">
                        <input
                            type="radio"
                            id="yearly"
                            name="plan"
                            checked={selectedPlan === "yearly"}
                            onChange={() => setSelectedPlan("yearly")}
                            className="h-4 w-4 text-blue-600 cursor-pointer"
                        />
                        <label htmlFor="yearly" className="flex justify-between items-center w-full">
                            <span>
                                Yearly <span className="ml-1 text-xs text-green-400">Save 15%</span>
                            </span>
                            <div className="flex flex-col">
                                <span>$8.33/month</span>
                                <span className="text-xs text-gray-400">$99.99 annually</span>
                            </div>
                        </label>
                    </div>
                    </>
                ) : (
                    <>
                    <button
                        onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!)}
                        className="flex justify-between items-center border border-black rounded-md px-4 py-2 text-sm font-medium text-white bg-black hover:bg-[#113663] transition"
                    >
                        <span>Monthly</span>
                        <span>$9.99/month</span>
                    </button>
                    <button
                        onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!)}
                        className="flex justify-between items-center border border-black rounded-md px-4 py-2 text-sm font-medium text-white bg-black hover:bg-[#113663] transition"
                    >
                        <span>
                            Yearly <span className="ml-1 text-xs text-green-400">Save 15%</span>
                        </span>
                        <span>
                            $9.99/month
                        <br />
                        <span className="text-xs text-gray-400">$99.99 annually</span>
                        </span>
                    </button>
                    </>
                )}
                </div>
            </div>

            {/* Payment Method */}
            <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-1">Payment Method</h3>
                <p className="text-sm text-gray-500 mb-2">Your default payment method</p>

                {loadingCard ? (
                    <div className="animate-pulse flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex items-center gap-2 mb-4 sm:mb-0">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div className="flex flex-col gap-1">
                                <Skeleton className="h-4 w-24 sm:w-32" />
                                <Skeleton className="h-3 w-20 sm:w-24" />
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Skeleton className="h-8 w-full sm:w-24 rounded-md" />
                            <Skeleton className="h-8 w-full sm:w-24 rounded-md" />
                        </div>
                    </div>
                    ) 
                :
                hasPaymentMethod ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5 text-blue-600" />
                    <div>
                        <p className="text-sm font-medium">
                            {customerData.paymentMethods[0].brand.charAt(0).toUpperCase() +
                                customerData.paymentMethods[0].brand.slice(1)} {" "}
                            **** {customerData.paymentMethods[0].last4}
                        </p>
                        <p className="text-xs text-gray-500">
                            Expires {customerData.paymentMethods[0].exp_month}/
                            {customerData.paymentMethods[0].exp_year.toString().slice(-2)}
                        </p>
                    </div>
                    </div>
                    <div className="flex gap-2 justify-between items-center">
                        <Button 
                            onClick={() => handleCardOpen(true)} 
                            className="text-sm"
                        >
                            <Edit2 className="h-5 w-5 sm:hidden" />
                            <span className="hidden sm:inline text-sm">Update card</span>
                        </Button>
                        <Button
                            onClick={handleDeleteCard}
                            className="text-sm"
                        >
                            <Trash2 className="h-5 w-5 sm:hidden" />
                            <span className="hidden sm:inline text-sm">Delete card</span>
                        </Button>
                    </div>
                </div>
                ) : (
                <div className="bg-red-50 border border-red-200 text-red-500 rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <AlertCircleIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Add a card to keep access!</span>
                    </div>
                    <Button
                        onClick={() => handleCardOpen(false)}
                        className="bg-black text-white px-3 py-1 rounded hover:bg-[#113663] text-sm"
                    >
                        Add card
                    </Button>
                </div>
                )}
            </div>
            
            {hasSubscription && (
                <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">Renews {new Date(renewalDate).toLocaleDateString()}</p>
                    <Button
                        disabled={(selectedPlan==="monthly" && isMonthlyPlan) || (selectedPlan==="yearly" && isYearlyPlan)}
                        onClick={handleUpdateBillingCycle}
                        className=""
                    >
                        {updatingPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Biilling Cycle"}
                    </Button>
                </div>
            )}

            {setupIntent && cardFormOpen && (
                <Elements stripe={stripePromise} options={{ clientSecret: setupIntent }}>
                    <AddPaymentMethodForm
                        open={cardFormOpen}
                        onOpenChange={setCardFormOpen}
                        onSuccess={handleCardSuccess}
                        isUpdate={updateCard}
                        setLoadingCard={updateLoadingCard}
                        {...(customerData?.paymentMethods?.length > 0
                            ? { existingPaymentMethodId: customerData.paymentMethods[0].id }
                        : {})}
                    />
                </Elements>
            )}

            {/* Billing History */}
            <div>
                <h3 className="text-sm font-medium mb-2">Billing History</h3>
                <div className="overflow-hidden">
                    <table className="table-fixed text-center w-full text-sm border rounded-md">
                        <colgroup>
                            <col className="w-1/5" />
                            <col className="w-1/5" />
                            <col className="w-1/5" />
                            <col className="w-1/5" />
                            <col className="w-1/5" />
                        </colgroup>

                        <thead className="bg-gray-100">
                            <tr className="text-center">
                            <th className="px-4 py-2 truncate">Invoice</th>
                            <th className="px-4 py-2 truncate">Amount</th>
                            <th className="px-4 py-2 truncate">Date</th>
                            <th className="px-4 py-2 truncate">Status</th>
                            <th className="px-4 py-2 truncate">Download</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loadingPlan
                            ? [...Array(5)].map((_, idx) => (
                                <tr key={idx} className="border-t text-center animate-pulse">
                                    {Array(5).fill(0).map((__, j) => (
                                    <td key={j} className="px-2 py-2">
                                        <div className="h-4 w-full bg-gray-200 rounded" />
                                    </td>
                                    ))}
                                </tr>
                                ))
                            : customerData?.invoices?.length > 0
                            ? customerData.invoices.map((inv, i) => (
                                <tr key={inv.id} className="border-t text-center">
                                    <td className="px-4 py-2 truncate">#{i + 1}</td>
                                    <td className="px-4 py-2 truncate">
                                    ${(inv.amount_paid / 100).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 truncate">
                                    {new Date(inv.created * 1000).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">
                                    <span
                                        className={`
                                        px-2 py-1 rounded-full text-xs font-medium
                                        ${inv.status === "paid"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-600"
                                        }
                                        `}
                                    >
                                        {inv.status[0].toUpperCase() + inv.status.slice(1)}
                                    </span>
                                    </td>
                                    <td className="px-4 py-2">
                                    <a
                                        href={inv.hosted_invoice_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        <DownloadIcon className="inline h-4 w-4" />
                                    </a>
                                    </td>
                                </tr>
                                ))
                            : (
                                <tr>
                                <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                                    No invoices found
                                </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {hasSubscription && (
                    <>
                        <Button
                            variant="destructive"
                            onClick={() => setConfirmOpen(true)}
                            disabled={loadingPlan}
                            className="mt-4 text-sm px-4 py-2 border rounded-md"
                        >
                            Cancel Subscription
                        </Button>

                        <ConfirmDialog
                            open={confirmOpen}
                            onConfirm={handleCancelSubscription}
                            onCancel={() => setConfirmOpen(false)}
                        />
                    </>
                )}
            </div>
        </div>
  )
}
