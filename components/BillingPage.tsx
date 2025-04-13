"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import {
  getCustomerDetails,
  createCheckoutSession,
  cancelSubscription,
  updateSubscription,
  createSetupIntent,
} from "@/app/actions/Stripe"
import { AddPaymentMethodForm } from "./AddPaymentMethodForm"
import { DownloadIcon, CreditCardIcon, AlertCircleIcon, Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast"
import { Button } from "./ui/button"
import { useBillingInfo } from "@/hooks/useBillingInfo"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function BillingPage() {
    const { user } = useUser();
    const userId = user?.id as any;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [customerData, setCustomerData] = useState<any>(null);
    const {
        hasSubscription,
        hasPaymentMethod,
        activeSubscription,
        isMonthlyPlan,
        isYearlyPlan,
        selectedPlan,
        setSelectedPlan,
      } = useBillingInfo(customerData);      
    const [cardFormOpen, setCardFormOpen] = useState(false);
    const [updateCard, setUpdateCard] = useState(false);
    const [setupIntent, setSetupIntent] = useState<string | null>(null);
    const [updatingPlan, setUpdatingPlan] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const data = await getCustomerDetails(userId)
                setCustomerData(data)
            } catch (error) {
                console.error("Error fetching customer data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCustomerData()
    }, [userId])

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
          const newPriceId =
            selectedPlan === "monthly"
              ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
              : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!
    
          await updateSubscription(userId, customerData.activeSubscription, newPriceId)
    
          toast({
            title: "Success",
            description: `Your subscription has been updated to the ${selectedPlan} plan. You'll see the prorated charges on your next invoice.`,
          })
    
          const data = await getCustomerDetails(userId)
          setCustomerData(data)
        } catch (error) {
          console.error("Error updating billing cycle:", error)
          toast({
            title: "Error",
            description: "Failed to update your billing cycle. Please try again.",
            variant: "destructive",
          })
        } finally {
          setUpdatingPlan(false)
        }
      }

    const handleSubscribe = async (priceId: string) => {
        try {
            setLoading(true)
            const { url } = await createCheckoutSession(userId, priceId)
            if (url) {
                router.push(url)
            }
        } catch (error) {
            console.error("Error creating checkout session:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancelSubscription = async () => {
        if (!activeSubscription) return;
        if (confirm("Are you sure you want to cancel your subscription?")) {
            try {
                setLoading(true)
                await cancelSubscription(userId, activeSubscription)
                const data = await getCustomerDetails(userId)
                setCustomerData(data)
            } catch (error) {
                console.error("Error canceling subscription:", error)
            } finally {
                setLoading(false)
            }
        }
    }

    const handleDeleteCard = async () => {
        const defaultPaymentMethodId = customerData.paymentMethods[0].id
      
        if (!defaultPaymentMethodId || !userId) {
          console.error("Missing userId or payment method ID.");
          return;
        }
      
      
        try {
            await fetch(`/api/users/${userId}/payment_methods/${defaultPaymentMethodId}`, {
                method: "DELETE",
            });
      
            const data = await getCustomerDetails(userId)
            setCustomerData(data)
      
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
        }
    };

    const handleCardOpen = async (isUpdate : boolean) => {
        try {
            const { clientSecret } = await createSetupIntent(userId);
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
        const data = await getCustomerDetails(userId)
        setCustomerData(data)
    }

    const renewalDate = customerData?.activeSubscription?.current_period_end
        ? new Date(customerData.activeSubscription.current_period_end * 1000).toLocaleDateString()
        : "N/A"

    if (loading) {
        return <div className="p-6 text-center">Loading billing information...</div>
    }
    

    return (
        <div className="p-6 space-y-6">
            {/* Subscription Plan */}
            <div className="border rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-medium">{hasSubscription ? "Subscription Plan" : "Select a plan"}</h3>
                <p className="text-sm text-gray-500">
                    {hasSubscription ? "Your current plan and billing cycle" : "Subscribe to access Linktank fully!"}
                </p>

                <div className="flex flex-col gap-3 pt-2">
                {hasSubscription ? (
                    <>
                    <div className="flex items-center gap-2 mb-2">
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
                    <div className="flex items-center gap-2">
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
                        <span>
                            $8.33/month
                            <br />
                            <span className="text-xs text-gray-400">$99.99 annually</span>
                        </span>
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

                {hasPaymentMethod ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5 text-blue-600" />
                    <div>
                        <p className="text-sm font-medium">
                            {customerData.paymentMethods[0].brand.charAt(0).toUpperCase() +
                                customerData.paymentMethods[0].brand.slice(1)}
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
                            Update card
                        </Button>
                        <Button
                            onClick={handleDeleteCard}
                            className="text-sm"
                        >
                            Delete card
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
                    <p className="text-xs text-gray-400">Renews {renewalDate}</p>
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
                        {...(customerData?.paymentMethods?.length > 0
                            ? { existingPaymentMethodId: customerData.paymentMethods[0].id }
                        : {})}
                    />
                </Elements>
            )}

            {/* Billing History */}
            <div>
                <h3 className="text-sm font-medium mb-2">Billing History</h3>
                <table className="w-full text-sm text-left border rounded-md overflow-hidden">
                <thead className="bg-gray-100">
                    <tr className="text-center">
                        <th className="px-4 py-2">Invoice</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Download</th>
                    </tr>
                </thead>
                <tbody>
                    {customerData?.invoices?.length > 0 ? (
                    customerData.invoices.map((invoice, index) => (
                        <tr key={invoice.id} className="border-t text-center">
                            <td className="px-4 py-2">#{index+1}</td>
                            <td className="px-4 py-2">${(invoice.amount_paid / 100).toFixed(2)}</td>
                            <td className="px-4 py-2">{new Date(invoice.created * 1000).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                                <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    invoice.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                }`}
                                >
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                <div className="flex justify-center items-center">
                                    <a
                                        href={invoice.hosted_invoice_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        <DownloadIcon className="h-4 w-4" />
                                    </a>
                                </div>
                            </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                        No invoices found
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>

                {hasSubscription && (
                    <button
                        onClick={handleCancelSubscription}
                        className="mt-4 text-sm px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Cancel Subscription
                    </button>
                )}
            </div>
        </div>
  )
}
