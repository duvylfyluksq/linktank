import dbConnect from "../../../../lib/dbConnect";
import Event from "../../../../models/Event";
import { NextResponse } from "next/server";
import Organization from "@/models/Organization";
import Speaker from "@/models/Speaker";

export async function GET(request: Request, context: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = context.params;
        const url = new URL(request.url);
        const orgId = url.searchParams.get("orgId");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Invalid ID" },
                { status: 400 }
            );
        }

        const event = await Event.findOne({
            _id: id,
            ...(orgId ? { organization: orgId } : {}),
        })
            .populate("organization", "name", Organization)
            .populate("speakers", "name photo_url url twitter title", Speaker)
            .exec();

        if (!event) {
            return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, event }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
