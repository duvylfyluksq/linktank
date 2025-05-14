import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export async function POST(
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

    const event = await Event.findByIdAndUpdate(
      id,
      { $set: { is_rejected: true } },
      { new: true, runValidators: true }
    );

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 },
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
