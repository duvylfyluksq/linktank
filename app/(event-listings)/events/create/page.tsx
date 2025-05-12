import AgendaSection from "@/components/AgendaSection";
import BasicInfoSection from "@/components/BasicInfoSection";
import SpeakersSection from "@/components/SpeakersSection";
import { Button } from "@/components/ui/button";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-bold">Submit an event</h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Fill in the details to submit an event to Linktank&apos;s directory
        </p>
        <BasicInfoSection/>
        <SpeakersSection/>
        <AgendaSection/>
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

