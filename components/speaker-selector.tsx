"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import { SpeakerCard } from "@/components/speaker-card" 
import { NewSpeakerForm } from "./new-speaker-form"

interface SpeakerSelectorProps {
  selectedSpeakers: any[]
  onSpeakersChange: (speakers: any[]) => void
}

export function SpeakerSelector({ selectedSpeakers, onSpeakersChange }: SpeakerSelectorProps) {
  const [showNewSpeakerForm, setShowNewSpeakerForm] = useState(false)

  const addSpeaker = (speaker: any) => {
    if (!selectedSpeakers.some((s) => s.id === speaker.id)) {
      onSpeakersChange([...selectedSpeakers, speaker])
    }
  }

  const removeSpeaker = (speakerId: number) => {
    onSpeakersChange(selectedSpeakers.filter((s) => s.id !== speakerId))
  }

  const handleAddNewSpeaker = (speaker: any) => {
    addSpeaker(speaker)
    setShowNewSpeakerForm(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">Add speakers to your event</p>
        <Button variant="outline" size="sm" onClick={() => setShowNewSpeakerForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Speaker
        </Button>
      </div>

      {selectedSpeakers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {selectedSpeakers.map((speaker) => (
            <SpeakerCard key={speaker.id} speaker={speaker} onRemove={removeSpeaker} showDetails={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <Users className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          <p>No speakers added yet</p>
          <p className="text-sm text-gray-500 mt-1">Add speakers to your event</p>
        </div>
      )}

      {/* New Speaker Modal */}
      <NewSpeakerForm
        isOpen={showNewSpeakerForm}
        onClose={() => setShowNewSpeakerForm(false)}
        onSave={handleAddNewSpeaker}
      />
    </div>
  )
}

