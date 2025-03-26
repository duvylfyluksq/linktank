import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import { NextResponse } from "next/server";
import Organization from "@/models/Organization";

export async function GET(request: Request) {
    await dbConnect();
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search");
    const orgId = url.searchParams.get("organization");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const locations = url.searchParams.getAll("locations");
    const eventType = url.searchParams.get("eventType");

    try {
        const query: any = {};

        // Handle search query
        if (searchQuery) {
            query.title = { $regex: searchQuery, $options: "i" };
        }

        // Handle organization filter
        if (orgId && orgId !== "all") {
            query.organization = orgId;
        }

        // Handle date range and event type filters
        if (eventType === "upcoming" || eventType === "past" || dateFrom || dateTo) {
            query.date_from = {};

            // If event type is "upcoming"
            if (eventType === "upcoming") {
                query.date_from.$gte = new Date();
            }
            // If event type is "past"
            else if (eventType === "past") {
                query.date_from.$lt = new Date();
            }

            // Apply custom date range if specified (these override the default event type dates)
            if (dateFrom) {
                query.date_from.$gte = new Date(dateFrom);
            }

            if (dateTo) {
                query.date_from.$lte = new Date(dateTo);
            }
        } else if (!eventType || eventType === "all") {
            // If no date filters and eventType is "all" or not specified,
            // don't apply any date filtering
        }

        // Handle location filters
        if (locations && locations.length > 0) {
            query.location = { $in: locations };
        }

        // Determine sort order
        let sortOrder;
        if (eventType === "past") {
            // For past events, show most recent first
            sortOrder = { date_from: -1 };
        } else {
            // For upcoming events or all events, show earliest first
            sortOrder = { date_from: 1 };
        }

        const events = await Event.find(query)
            .sort(sortOrder)
            .populate("organization", "name logo_url", Organization)
            .exec();

        return NextResponse.json(
            { success: true, events: events },
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