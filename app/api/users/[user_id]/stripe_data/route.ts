import { getCustomerDetails } from "@/app/actions/Stripe";
import { NextResponse } from "next/server";

export async function GET(
    req: Request, { params }: { params: Promise<{ user_id: string }> }){
  const { user_id } = await params;

  if (!user_id) {
    return NextResponse.json({ success: false, error: "Missing user ID" }, { status: 400 });
  }

  try {
    const data = await getCustomerDetails(user_id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Stripe fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch Stripe data" }, { status: 500 });
    }
}