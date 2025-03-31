"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

interface SavedEventsContextType {
  savedEvents: Event[]; 
  setSavedEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

const SavedEventsContext = createContext<SavedEventsContextType | undefined>(undefined);

export function SavedEventsProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetch(`/api/users/${user.id}/saved_events`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSavedEvents(data.saved_events);
          }
        })
        .catch((error) => {
          console.error("Error fetching saved events:", error);
        });
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <SavedEventsContext.Provider value={{ savedEvents, setSavedEvents }}>
      {children}
    </SavedEventsContext.Provider>
  );
}

export function useSavedEvents() {
  const context = useContext(SavedEventsContext);
  if (!context) {
    throw new Error("useSavedEvents must be used within a SavedEventsProvider");
  }
  return context;
}
