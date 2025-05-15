"use client";

import AgendaSection from "@/components/AgendaSection";
import BasicInfoSection, { BasicInfoValues } from "@/components/BasicInfoSection";
import SpeakersSection from "@/components/SpeakersSection";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function CreateEventPage() {

  const [basicInfo, setBasicInfo] = useState<BasicInfoValues>({
    title: "",
    briefDescription: "",
    description: "",
    url: "",
    organizationId: "",
    photoUrl: "",
    startDate: new Date(),
    startTime: "09:00",
    endDate: new Date(),
    endTime: "17:00",
    isDateRange: false,
    isVirtual: false,
    isInPerson: true,
    location: "",
    meetingUrl: "",
  });

  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  const [agenda, setAgenda] = useState<DayAgenda[]>([]);

  useEffect(() => {
    console.log(basicInfo)
    console.log(speakers)
  }, [basicInfo, speakers])

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-bold">Submit an event</h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Fill in the details to submit an event to Linktank&apos;s directory
        </p>
        <BasicInfoSection value={basicInfo} onChange={setBasicInfo}/>
        <SpeakersSection
          value={speakers}
          onChange={setSpeakers}
        />
        <AgendaSection
          value={agenda}
          onChange={setAgenda}
        />
        <div className="w-full mb-10 flex justify-center">
          <Button
            size="lg"
            className="
              w-full
              sm:w-3/4
              md:w-1/2
              lg:w-1/3
              px-8 py-4
              hover:bg-[#0e3b69]
            "
          >
            Submit event
          </Button>
        </div>
      </div>
    </div>
  )
}

