/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import Organization from "@/models/Organization";

export async function GET(_req: NextRequest) {
	await dbConnect();

	try {
		const events = await Event.find({ date_from: { $lt: new Date() } })
			.sort({ date_from: -1 })
			.populate("organization", "name", Organization)
			.exec();

		return NextResponse.json({ success: true, events });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 },
		);
	}
}
