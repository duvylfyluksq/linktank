import { useEffect, useState, useMemo, useCallback } from "react";
import { addMonths, addYears } from "date-fns";
import { getCustomerDetails } from "@/app/actions/Stripe";

export function useBillingInfo(userId?: string) {
  const [customerData, setCustomerData] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [loadingCard, setLoadingCard] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchCustomerData = async () => {
      try {
        setLoadingPlan(true);
        setLoadingCard(true);
        const data = await getCustomerDetails(userId);
        setCustomerData(data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoadingPlan(false);
        setLoadingCard(false);
      }
    };
    fetchCustomerData();
  }, [userId]);

  const updateCustomerData = useCallback((data: any) => {
    setCustomerData(data);
  }, []);

  const updateLoadingPlan = useCallback((loadingPlan: boolean) => {
    setLoadingPlan(loadingPlan);
  }, []);

  const updateLoadingCard = useCallback((loadingCard: boolean) => {
    setLoadingCard(loadingCard);
  }, []);

  const billingInfo = useMemo(() => {
    const hasSubscription = customerData?.hasActiveSubscription ?? false;
    const hasPaymentMethod = customerData?.paymentMethods?.length > 0;
    const activeSubscription = customerData?.customer?.subscriptions?.[0]?.id;
    const currentPlan = customerData?.customer?.subscriptions?.[0]?.plan?.id;
    const isMonthlyPlan = currentPlan === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID;
    const isYearlyPlan = currentPlan === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID;
    const defaultSelectedPlan: "monthly" | "yearly" = isYearlyPlan ? "yearly" : "monthly";
    const billingCycleAnchor = customerData?.customer?.subscriptions?.[0]?.billing_cycle_anchor;
    const renewalDate = hasSubscription && billingCycleAnchor
      ? isYearlyPlan
        ? addYears(new Date(billingCycleAnchor * 1000), 1)
        : addMonths(new Date(billingCycleAnchor * 1000), 1)
      : "NA";

    return {
      hasSubscription,
      hasPaymentMethod,
      activeSubscription,
      currentPlan,
      isMonthlyPlan,
      isYearlyPlan,
      defaultSelectedPlan,
      renewalDate,
    };
  }, [customerData]);

  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    setSelectedPlan(billingInfo.defaultSelectedPlan);
  }, [billingInfo.defaultSelectedPlan]);

  return {
    ...billingInfo,
    selectedPlan,
    setSelectedPlan,
    customerData,
    updateCustomerData,
    loadingPlan,
    updateLoadingPlan,
    loadingCard,
    updateLoadingCard
  };
}
