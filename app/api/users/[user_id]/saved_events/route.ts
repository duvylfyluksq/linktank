import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Event from "@/models/Event"

export async function GET(request: Request, { params }: { params: Promise<{ user_id: string}> }) {
  await dbConnect();
  try{
    const { user_id } = await params;
    const user = await User.findOne({ clerk_id: user_id })
                        .populate({path: "saved_events", model: Event})
                        .lean() as any; 
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, saved_events: user.saved_events });
  } catch(error){
    console.error("Error getting saved events:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 }); 
  }
}