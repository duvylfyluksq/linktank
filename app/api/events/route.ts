import dbConnect from "../../../lib/dbConnect";
import Event from "../../../models/Event";
import { NextResponse } from "next/server";
import Organization from "@/models/Organization";

export async function GET() {
    await dbConnect();
    try {
        const events = await Event.find({ date_from: { $gte: new Date() } }).sort({ date_from: 1 }).populate("organization", "name", Organization).exec();
        return NextResponse.json({ success: true, events: events }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false }, { status: 400 });
    }
}