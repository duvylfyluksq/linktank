import { EventForm } from "@/components/event-form";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold">Create New Event</h1>
            <p className="text-gray-500 text-sm sm:text-base mt-1">Fill in the details to create your event</p>
          </div>

          <EventForm />
        </div>
      </div>
    </div>
  )
}

