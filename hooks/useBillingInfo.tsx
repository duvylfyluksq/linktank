import { useState, useEffect, useMemo } from "react";

export function useBillingInfo(customerData: any) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

  const billingInfo = useMemo(() => {
    const hasSubscription = customerData?.hasActiveSubscription ?? false;
    const hasPaymentMethod = customerData?.paymentMethods?.length > 0;
    const activeSubscription = customerData?.customer?.subscriptions?.[0]?.id;
    const currentPlan = customerData?.customer?.subscriptions?.[0]?.plan?.id;
    const isMonthlyPlan = currentPlan === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;
    const isYearlyPlan = currentPlan === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID;

    const defaultSelectedPlan: "monthly" | "yearly" = isYearlyPlan ? "yearly" : "monthly";

    return {
      hasSubscription,
      hasPaymentMethod,
      activeSubscription,
      currentPlan,
      isMonthlyPlan,
      isYearlyPlan,
      defaultSelectedPlan,
    };
  }, [customerData]);

  useEffect(() => {
    setSelectedPlan(billingInfo.defaultSelectedPlan);
  }, [billingInfo.defaultSelectedPlan]);

  return {
    ...billingInfo,
    selectedPlan,
    setSelectedPlan,
  };
}
