import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Event from "@/models/Event";

export async function DELETE(request: Request, { params }: { params: Promise<{ user_id: string, event_id: string }> }){
    await dbConnect();
    try{
        const { user_id, event_id } = await params;
        const event = await Event.findOne({ backlink: event_id });
        const user = await User.findOneAndUpdate(
            { clerk_id: user_id },
            { $pull: { saved_events: event._id } },
            { new: true }
        )
        .populate({path: "saved_events", model: Event})
        .lean() as any;
    
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
    
        return NextResponse.json({ success: true, saved_events: user.saved_events });
    } catch (error) {
        console.error("Error deleting saved event:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
      }
}

export async function POST(request: Request, { params }: { params: Promise<{ user_id: string, event_id: string }> }){
    await dbConnect();
    try{
        const { user_id, event_id } = await params;
        const event = await Event.findOne({ backlink: event_id });
        const user = await User.findOneAndUpdate(
            { clerk_id: user_id},
            { $addToSet: { saved_events: event } },
            { new: true }
          )
          .populate({path: "saved_events", model: Event})
          .lean() as any;
        
          if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
          }
        
          return NextResponse.json({ success: true, saved_events: user.saved_events });
    } catch(error){
        console.error("Error adding saved event:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 }); 
    }

}