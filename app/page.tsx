// app/landing/page.tsx (or wherever appropriate in the app directory)

import Landing from "./landing";

async function getPastEvents() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/past`,
            {
                cache: "no-store", // or "force-cache", "revalidate", etc., depending on your needs
            }
        );

        const data = await response.json();

        if (data.success) {
            const eventsWithDates = data.events.slice(0, 4).map((ev: any) => ({
                ...ev,
                date_from: new Date(ev.date_from),
                alrSaved: ev.alrSaved || false,
            }));

            return eventsWithDates;
        }
    } catch (error) {
        console.error("Error fetching past events:", error);
        return [];
    }
}

export default async function LandingPage() {
    const events = await getPastEvents();
    return <Landing events={events} />;
}
