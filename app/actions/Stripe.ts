"use server"

import { stripe } from "@/lib/stripe"
import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

async function getUserStripeId(userId: string) {
  await dbConnect()
  const user = await User.findOne({ clerk_id: userId })
  if (!user || !user.stripe_id) {
    throw new Error("User not found or missing Stripe ID")
  }
  return user.stripe_id
}

export async function getCustomerDetails(userId: string) {
    try {
      const stripeId = await getUserStripeId(userId);
  
      const customer = await stripe.customers.retrieve(stripeId, {
        expand: ["subscriptions.data", "invoice_settings.default_payment_method"],
      }) as any;
      
      if (customer.deleted) {
        return {
          customer: null,
          paymentMethods: [],
          invoices: [],
          hasActiveSubscription: false,
          activeSubscription: null,
        };
      }

      const paymentMethods = await stripe.paymentMethods.list({
        customer: stripeId,
        type: "card",
      }); 

      const invoices = await stripe.invoices.list({
        customer: stripeId
      });
  
      return {
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          metadata: customer.metadata,
          invoice_settings: customer.invoice_settings,
          subscriptions: customer.subscriptions.data.map((sub) => ({
            id: sub.id,
            status: sub.status,
            billing_cycle_anchor: sub.billing_cycle_anchor,
            current_period_end: sub.current_period_end,
            plan: {
              id: sub.items.data[0]?.plan.id,
              amount: sub.items.data[0]?.plan.amount,
              interval: sub.items.data[0]?.plan.interval,
            },
          })),
        },
        paymentMethods: paymentMethods.data.map((pm) => ({
          id: pm.id,
          brand: pm.card?.brand,
          last4: pm.card?.last4,
          exp_month: pm.card?.exp_month,
          exp_year: pm.card?.exp_year,
        })),
        invoices: invoices.data.map((inv) => ({
          id: inv.id,
          amount_remaining: inv.amount_remaining,
          amount_shipping: inv.amount_shipping,
          amount_overpaid: inv.amount_overpaid,
          amount_paid: inv.amount_paid,
          amount_due: inv.amount_due,
          status: inv.status,
          hosted_invoice_url: inv.hosted_invoice_url,
          created: inv.created,
        })),
        hasActiveSubscription:
          customer.subscriptions?.data.some((sub) => ["active", "trialing"].includes(sub.status)) || false,
        activeSubscription:
          customer.subscriptions?.data.find((sub) => ["active", "trialing"].includes(sub.status))?.id || null,
      };
    } catch (error) {
      console.error("Error fetching customer details:", error);
      return {
        customer: null,
        paymentMethods: [],
        invoices: [],
        hasActiveSubscription: false,
        activeSubscription: null,
      };
    }
  }

export async function createCheckoutSession(userId: string, priceId: string) {
  try {
    const stripeId = await getUserStripeId(userId)

    const session = await stripe.checkout.sessions.create({
        customer: stripeId,
        payment_method_types: ["card"],
        line_items: [
            {
            price: priceId,
            quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    })

    return { url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

// Create a billing portal session
// export async function createBillingPortalSession(userId: string) {
//   try {
//     const stripeId = await getUserStripeId(userId)

//     const session = await stripe.billingPortal.sessions.create({
//       customer: stripeId,
//       return_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
//     })

//     console.log(session);

//     return { url: session.url }
//   } catch (error) {
//     console.error("Error creating billing portal session:", error)
//     throw new Error("Failed to create billing portal session")
//   }
// }

export async function cancelSubscription(userId: string, subscriptionId: string) {
  try {
    await stripe.subscriptions.cancel(subscriptionId)
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error canceling subscription:", error)
    throw new Error("Failed to cancel subscription")
  }
}

export async function updateSubscription(userId: string, subscriptionId: string, newPriceId: string) {
  try {
    // Get the current subscription to access its items
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Update the subscription with proration settings
    await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      // This enables prorating - the customer will be charged or credited for unused time
      proration_behavior: "always_invoice",
      // Create an invoice immediately for the prorated amount
      billing_cycle_anchor: "now",
      // Expand the latest invoice to get access to the invoice URL
      expand: ["latest_invoice"],
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating subscription:", error)
    throw new Error("Failed to update subscription")
  }
}

export async function createSetupIntent(
  userId: string,
){
    try {
        const stripeId = await getUserStripeId(userId)
        const intentData: any = {
          customer: stripeId,
          payment_method_types: ["card"],
          usage: "off_session",
        }

        const setupIntent = await stripe.setupIntents.create(intentData)
        return { clientSecret: setupIntent.client_secret }
    } catch (error) {
        console.error("Error creating setup intent:", error)
        throw new Error("Failed to create setup intent")
    }
}

export async function detachPaymentMethod(paymentMethodId: string) {
  if (!paymentMethodId) {
    throw new Error("Missing paymentMethodId")
  }

  try {
    return await stripe.paymentMethods.detach(paymentMethodId)
  } catch (error) {
    console.error("Stripe: Failed to detach payment method", error)
    throw new Error("Stripe error: Failed to detach payment method")
  }
}

export async function setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
  if (!userId || !paymentMethodId) throw new Error("Missing parameters")

  try {

    const customerId = await getUserStripeId(userId);

    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId })

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })
  } catch (err) {
    console.error("Failed to set default payment method:", err)
    throw new Error("Could not update Stripe customer")
  }
}
