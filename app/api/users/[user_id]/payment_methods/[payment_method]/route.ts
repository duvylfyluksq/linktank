import { NextResponse } from "next/server"
import { detachPaymentMethod, setDefaultPaymentMethod } from "@/app/actions/Stripe"

export async function DELETE(
  req: Request, { params }: { params: Promise<{ user_id: string, payment_method: string }> }) {

    const { user_id, payment_method } = await params

    if (!user_id || !payment_method) {
        return NextResponse.json({ error: "Missing payment method ID" }, { status: 400 })
    }

    try {
        await detachPaymentMethod(payment_method)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to detach:", error)
        return NextResponse.json({ error: "Failed to detach payment method" }, { status: 500 })
    }
}

export async function POST(
  req: Request, {params}: { params: Promise<{ user_id: string, payment_method: string }> }) {

    const { user_id, payment_method } = await params

    if (!user_id || !payment_method) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    try {
        await setDefaultPaymentMethod(user_id, payment_method)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to set default:", error)
        return NextResponse.json({ error: "Failed to set default payment method" }, { status: 500 })
    }
}
