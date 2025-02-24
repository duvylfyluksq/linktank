import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import Organization from "@/models/Organization";
import Speaker from "@/models/Speaker";

export async function GET(request: NextRequest) {
	await dbConnect();

	const { searchParams } = new URL(request.url);
	//  comma-separated list of event ids
	const savedIdsParam = searchParams.get("savedIds");
	if (!savedIdsParam) {
		return NextResponse.json(
			{ success: false, message: "Missing savedIds query parameter" },
			{ status: 400 },
		);
	}

	const idArray = savedIdsParam.split(",");

	try {
		// Use _id instead of backlink
		const events = await Event.find({ _id: { $in: idArray } })
			.populate("organization", "name", Organization)
			.populate("speakers", "name photo_url url twitter title", Speaker)
			.exec();

		return NextResponse.json({ success: true, events }, { status: 200 });
	} catch (error) {
		console.error("Error fetching events:", error);
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 },
		);
	}
}
