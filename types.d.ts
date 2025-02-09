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

interface Event {
    title: string;
    date_from: Date; // Assuming date_from is a Date object
    date_to?: Date; // Optional
    url: string; // Assuming URLField is a string
    ticket_url?: string; // Optional
    brief_description?: string; // Optional
    description: string;
    agenda?: string; // Optional
    speakers?: Speaker[];
    organization?: Organization;
    photo_url?: string; // Optional
    is_virtual?: boolean; // Optional
    is_in_person?: boolean; // Optional
    location: string;
    address?: string; // Optional
    room?: string; // Optional
    city?: string; // Optional
    state?: string; // Optional
    zip_code?: string; // Optional, 5-digit zip code
    country: string;
    keywords?: string[]; // Optional
    contact_name?: string; // Optional
    contact_phone?: string; // Optional
    contact_email?: string; // Optional
}
