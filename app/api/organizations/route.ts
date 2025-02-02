import dbConnect from "@/lib/dbConnect";
import Organization from "@/models/Organization";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();

    try {
        const organizations = await Organization.find({}, "name").exec();
        return NextResponse.json(
            { success: true, organizations },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
