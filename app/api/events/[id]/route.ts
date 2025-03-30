import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import Organization from "@/models/Organization";
import Speaker from "@/models/Speaker";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	await dbConnect();

	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ success: false, message: "Invalid ID" },
				{ status: 400 },
			);
		}

		const event = await Event.findOne({
			backlink: id,
		})
			.populate("organization", "name logo_url", Organization)
			.populate("speakers", "name photo_url url twitter title", Speaker)
			.lean()
			.exec() as any;

		if (!event) {
			return NextResponse.json(
				{ success: false, message: "Event not found" },
				{ status: 404 },
			);
		}

		if (event.agenda) {
			event.agenda = await Promise.all(
			  event.agenda.map(async (dayAgenda) => {
				return await Promise.all(
				  dayAgenda.map(async (agendaItem) => {
					if (agendaItem.speakers) {
					  const populatedSpeakers = await Promise.all(
						agendaItem.speakers.map(async (speakerId) => {
						  return await Speaker.findById(speakerId)
							.select("name photo_url url twitter title")
							.lean();
						})
					  );
					  agendaItem.speakers = populatedSpeakers;
					}
					return agendaItem;
				  })
				);
			  })
			);
		  }

		return NextResponse.json({ success: true, event });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 },
		);
	}
}
