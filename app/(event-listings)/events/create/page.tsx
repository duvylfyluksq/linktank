"use client";

import AgendaSection from "@/components/AgendaSection";
import BasicInfoSection, { BasicInfoValues } from "@/components/BasicInfoSection";
import SpeakersSection from "@/components/SpeakersSection";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";


export default function CreateEventPage() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    
    setSubmitting(true);

    const df = new Date(
      basicInfo.startDate.toDateString() + " " + basicInfo.startTime
    ).toISOString();
    const dt = basicInfo.isDateRange
      ? new Date(
          basicInfo.endDate!.toDateString() + " " + basicInfo.endTime!
        ).toISOString()
      : undefined;

    const payload = {
      title: basicInfo.title,
      date_from: df,
      date_to: dt,
      url: basicInfo.url,
      ticket_url: basicInfo.meetingUrl,
      brief_description: basicInfo.briefDescription,
      description: basicInfo.description,
      speakers: speakers,            
      agenda: agenda,              
      organization: basicInfo.organizationId,
      photo_url: basicInfo.photoUrl,
      is_virtual: basicInfo.isVirtual,
      is_in_person: basicInfo.isInPerson,
      is_date_range: basicInfo.isDateRange,
      location: basicInfo.location,
    };

    const res = await fetch("/api/events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      toast({
        title: "Success",
        description: "Event submitted successfully!"
      })
      router.push(`/`);
    } else {
      console.error("Failed to create:", data.message);
      toast({
        title: "Error",
        description: "Error submitting event",
        variant: "destructive",
      })
    }
    setSubmitting(false);
  };

  useEffect(() => {
    console.log(basicInfo)
    console.log(speakers)
    console.log(agenda)
  }, [basicInfo, speakers, agenda])

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
            onClick={handleSubmit}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit event"}
          </Button>
        </div>
      </div>
    </div>
  )
}

