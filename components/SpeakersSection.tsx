"use client";

import { useState } from "react";
import Section from "./section";
import { SpeakerSelector } from "@/components/speaker-selector"

export default function SpeakersSection(){
    const [speakers, setSpeakers] = useState<Speaker[]>([])

    return(
        <Section title="Speakers">
            <SpeakerSelector selectedSpeakers={speakers} onSpeakersChange={setSpeakers} />
        </Section>
    )
}