import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import { NextResponse } from "next/server";
import Organization from "@/models/Organization";
import City from "@/models/City";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect();
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search");
    const orgId = url.searchParams.get("organization");
    const date = url.searchParams.get("date");
    const locations = url.searchParams.getAll("locations");
    const dateType = url.searchParams.get("dateType");
    const locationType = url.searchParams.get("locationType");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;
    console.log(locations);
    try {
        const query: any = {};

        if (searchQuery) {
            query.title = { $regex: searchQuery, $options: "i" };
        }

        if (orgId && orgId !== "all") {
            query.organization = orgId;
        }

        if (locations && locations.length > 0) {
            query.location_tag = {
                $in: locations.map((id) => new mongoose.Types.ObjectId(id)),
            };
        }

        if(locationType == "online") query.is_virtual = true;
        else if(locationType == "in-person") query.is_in_person = true;
        else if(locationType == "hybrid"){
            query.is_virtual = true;
            query.is_in_person = true;
        }

        const now = new Date();

        if (date) {
            const selectedDate = new Date(date);
            const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

            query.date_from = {
                $gte: startOfDay,
                $lte: endOfDay,
            };
        } else if (dateType === "past") {
            query.date_from = { $lt: now };
        } else if (dateType === "upcoming") {
            query.date_from = { $gte: now };
        }

        // Determine sort order
        let sortOrder;
        if (dateType === "past") {
            sortOrder = { date_from: -1 };
        } else {
            sortOrder = { date_from: 1 };
        }

        const events = await Event.find(query)
            .sort(sortOrder)
            .skip(skip)
            .limit(limit)
            .populate({path: "organization", model: Organization})
            .populate({path: "location_tag", model: City})
            .exec();

        const totalCount = await Event.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json(
            { 
                success: true, 
                events: events,
                hasMore : page < totalPages
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in event search API:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 400 });
    }
}