"use client";

import { useEffect, useMemo, useState } from "react";
import { useSavedEvents } from "../../contexts/SavedEventsContext";
import { useUser } from "@clerk/nextjs";
import SubscriptionPage from "@/app/(authwall)/authwall";
import { useEventFilters } from "@/hooks/useEventFilters";
import EventListings from "../EventListings";


export default function Home() {

    const [events, setEvents] = useState<EventModel[]>([]);
    const {savedEvents} = useSavedEvents();
    const [loading, setLoading] = useState(true);
    const loadingState = useMemo(
        () => ({ loading, setLoading }),
        [loading]
    );
    const filters = useEventFilters();
    const { isSignedIn } = useUser();
    

    useEffect(() => {
        const now = new Date();
      
        setEvents(savedEvents.filter((event) => {
          if (
            filters.organization_id !== "all" &&
            event.organization._id !== filters.organization_id
          ) {
            return false;
          }
      
          if (filters.locations && (!event.location_tag || !filters.locations.includes(event.location_tag._id))) return false;

          if (filters.location_type === "in-person" && !event.is_in_person) return false;
          if (filters.location_type === "online" && !event.is_virtual) return false;
          if (filters.location_type === "hybrid" &&
            !(event.is_virtual && event.is_in_person)
          )
            return false;
      
          const dateFrom = new Date(event.date_from);
          const dateTo = event.date_to ? new Date(event.date_to) : dateFrom;
      
          if (filters.date) {
            const selectedDate = filters.date;
            const sameDay =
              dateFrom.getFullYear() === selectedDate.getFullYear() &&
              dateFrom.getMonth() === selectedDate.getMonth() &&
              dateFrom.getDate() === selectedDate.getDate();
      
            return sameDay;
          }
      
          if (filters.date_type === "past" && dateFrom >= now) return false;
          if (filters.date_type === "upcoming" && dateTo < now) return false;
      
          return true;
        }));
      }, [savedEvents, filters]);

    
    useEffect(() => {
        if(savedEvents) setLoading(false);
    }, [savedEvents]);

    if(!isSignedIn){
        return <SubscriptionPage/>;
    }
    

    return (
        <EventListings
            Header={()=>(
                <div>
                    <h3 className="text-[2rem] font-jakarta font-extrabold max-sm:text-[18px] ">
                        My calendar
                    </h3>
                    <p className="text-gray-700">
                        These are your saved events
                    </p>
                </div>
            )}
            filters={filters}
            events={events}
            loadingState={loadingState}
        />
    );
}
