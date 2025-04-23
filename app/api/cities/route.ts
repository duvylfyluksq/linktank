import dbConnect from "@/lib/dbConnect";
import City from "@/models/City";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();

    try {
        const cities = await City.find({}).exec();
        return NextResponse.json(
            { success: true, cities },
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
