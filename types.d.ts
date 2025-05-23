interface Speaker {
    name: string;
    title?: string; // Optional
    affiliation?: string; // Optional
    role?: string; // Optional
    bio?: string; // Optional
    photo_url?: string; // Optional, assuming URLField is a string
    url?: string; // Optional, assuming URLField is a string
    twitter?: string; // Optional
    linkedin?: string;
}

interface Organization {
    _id: string;
    name: string;
    url: string; // Assuming URLField is a string
    events_url: string; // Assuming URLField is a string
    logo_url?: string; // Optional, assuming URLField is a string
}

interface City {
    _id: string;
    name: string;
}

interface User {
    clerk_id: string,
    stripe_id: string,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    saved_events: Event[],
    created_at: Date,
    updated_at: Date,
    last_sign_in_at: Date
}

interface AgendaItem {
    start_time: Date;
    end_time: Date;
    topic: string;
    brief_description: string;
    speakers: Speaker[];
}

interface DayAgenda {
  items: AgendaItem[];
}

interface Event extends Document {
    _id: string;
    title: string;
    date_from: Date;
    date_to?: Date;
    url: string;
    ticket_url?: string;
    brief_description?: string;
    description: string;
    agenda?: AgendaItem[][];
    speakers?: Speaker[];
    organization: Organization;
    photo_url?: string;
    is_date_range: boolean;
    is_virtual?: boolean;
    is_in_person?: boolean;
    location: string;
    location_tag?: City;
    address?: string;
    room?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    keywords?: string[];
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
    backlink: string;
    is_approved: boolean;
    is_rejected: boolean;
}

type EventModel = Event;

interface EventFilter{
    location_type: "online" | "in-person" | "hybrid" | "all";
    locations: City["_id"][];
    date_type: "upcoming" | "past" | "all";
    date: Date | undefined;
    organization_id: Organization["_id"] | "all";
}