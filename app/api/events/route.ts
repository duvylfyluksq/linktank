import dbConnect from "../../../lib/dbConnect";
import Event from "../../../models/Event";
import { NextResponse } from "next/server";
import Organization from "@/models/Organization";

export async function GET(request: Request) {
    await dbConnect();
    const url = new URL(request.url);
    const orgId = url.searchParams.get("organization");

    try {
        const query = orgId 
        ? { date_from: { $gte: new Date() }, organization: orgId }
        : { date_from: { $gte: new Date() } };
        const events = await Event.find(query)
            .sort({ date_from: 1 })
            .populate({path: "organization", model: Organization})
            .exec();
        return NextResponse.json(
            { success: true, events: events },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false }, { status: 400 });
    }
}