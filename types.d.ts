interface Speaker {
    name: string;
    title?: string; // Optional
    affiliation?: string; // Optional
    role?: string; // Optional
    bio?: string; // Optional
    photo_url?: string; // Optional, assuming URLField is a string
    url?: string; // Optional, assuming URLField is a string
    twitter?: string; // Optional
}
interface Organization {
    id: string;
    name: string;
    url: string; // Assuming URLField is a string
    events_url: string; // Assuming URLField is a string
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
    agenda?: string;
    speakers?: string[];
    organization?: Organization;
    photo_url?: string;
    is_virtual?: boolean;
    is_in_person?: boolean;
    location: string;
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
    backlink?: string;
    alrSaved: boolean;
}
