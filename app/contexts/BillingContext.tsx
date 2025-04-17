"use client";

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { addMonths, addYears } from "date-fns";
import { useUser } from "@clerk/nextjs";

interface BillingContextValue {
  customerData: any;
  updateCustomerData: (data: any) => void;
  loadingPlan: boolean;
  updateLoadingPlan: (loading: boolean) => void;
  loadingCard: boolean;
  updateLoadingCard: (loading: boolean) => void;
  selectedPlan: "monthly" | "yearly";
  setSelectedPlan: (plan: "monthly" | "yearly") => void;
  hasSubscription: boolean;
  hasPaymentMethod: boolean;
  activeSubscription: string | undefined;
  currentPlan: string | undefined;
  isMonthlyPlan: boolean;
  isYearlyPlan: boolean;
  defaultSelectedPlan: "monthly" | "yearly";
  renewalDate: Date | "NA";
}

const BillingContext = createContext<BillingContextValue | undefined>(undefined);

export const BillingProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isSignedIn } = useUser();
  const [customerData, setCustomerData] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingCard, setLoadingCard] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    if (!isSignedIn || !user?.id) return;

    const fetchCustomerData = async () => {
      try {
        setLoadingPlan(true);
        setLoadingCard(true);
        const response = await fetch(`/api/users/${user?.id}/stripe_data`);
        const result = await response.json();
        setCustomerData(result.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoadingPlan(false);
        setLoadingCard(false);
      }
    };

    fetchCustomerData();
  }, [isSignedIn, user?.id]);

  const updateCustomerData = useCallback((data: any) => {
    setCustomerData(data);
  }, []);

  const updateLoadingPlan = useCallback((value: boolean) => {
    setLoadingPlan(value);
  }, []);

  const updateLoadingCard = useCallback((value: boolean) => {
    setLoadingCard(value);
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
    const renewalDate: Date | "NA" =
        hasSubscription && billingCycleAnchor
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

  useEffect(() => {
    setSelectedPlan(billingInfo.defaultSelectedPlan);
  }, [billingInfo.defaultSelectedPlan]);

  return (
    <BillingContext.Provider
      value={{
        ...billingInfo,
        customerData,
        updateCustomerData,
        loadingPlan,
        updateLoadingPlan,
        loadingCard,
        updateLoadingCard,
        selectedPlan,
        setSelectedPlan,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBillingInfo = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error("useBillingInfo must be used within a BillingProvider");
  }
  return context;
};
