import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import { NextResponse } from "next/server";
import Organization from "@/models/Organization";

export async function GET(request: Request) {
    await dbConnect();
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search");
    const orgId = url.searchParams.get("organization");

    try {
        const query:any = { date_from: { $gte: new Date() } };

        if (searchQuery) {
            query.title = { $regex: searchQuery, $options: "i" };
        }

        if (orgId) {
            query.organization = orgId;
        }

        const events = await Event.find(query)
            .sort({ date_from: 1 })
            .populate("organization", "name", Organization)
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
