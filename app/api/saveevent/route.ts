import dbConnect from "@/lib/dbConnect";
import { NextResponse, type NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server"; // or your auth provider
import SavedEvent from "@/models/SavedEvent";

export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const { userId: clerkUserId } = getAuth(request);
		if (!clerkUserId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 },
			);
		}

		const { eventId } = await request.json();
		if (!eventId) {
			return NextResponse.json(
				{ success: false, message: "Missing eventId" },
				{ status: 400 },
			);
		}

		const existing = await SavedEvent.findOne({ userId: clerkUserId, eventId });
		if (existing) {
			return NextResponse.json(
				{ success: true, message: "Event already saved" },
				{ status: 200 },
			);
		}

		const savedEvent = await SavedEvent.create({
			userId: clerkUserId,
			eventId,
		});
		return NextResponse.json({ success: true, savedEvent }, { status: 201 });
	} catch (error) {
		console.error("Error saving event:", error);
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 },
		);
	}
}
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { userId: clerkUserId } = getAuth(request);
		if (!clerkUserId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 },
			);
		}

		const savedEvents = await SavedEvent.find({ userId: clerkUserId });

		const eventIds = savedEvents.map((event) => event.eventId);

		return NextResponse.json({ success: true, eventIds }, { status: 200 });
	} catch (error) {
		console.error("Error fetching saved events:", error);
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 },
		);
	}
}
export async function DELETE(request: NextRequest) {
	try {
		await dbConnect();

		const { eventId } = await request.json();
		if (!eventId) {
			return NextResponse.json(
				{ success: false, message: "Missing eventId" },
				{ status: 400 },
			);
		}

		const { userId: clerkUserId } = getAuth(request);
		if (!clerkUserId) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 },
			);
		}

		const result = await SavedEvent.deleteOne({ userId: clerkUserId, eventId });
		if (result.deletedCount > 0) {
			return NextResponse.json(
				{ success: true, message: "Saved event removed" },
				{ status: 200 },
			);
		}
		return NextResponse.json(
			{ success: false, message: "No saved event found" },
			{ status: 404 },
		);
	} catch (error) {
		console.error("Error unsaving event:", error);
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 },
		);
	}
}
