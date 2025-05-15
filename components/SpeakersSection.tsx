"use client";

import Section from "./section";
import { SpeakerSelector } from "@/components/speaker-selector"

export interface SpeakersSectionProps {
  value: Speaker[];
  onChange: (speakers: Speaker[]) => void;
}

export default function SpeakersSection({
  value,
  onChange,
}: SpeakersSectionProps) {
    return(
        <Section title="Speakers">
            <SpeakerSelector selectedSpeakers={value} onSpeakersChange={onChange} />
        </Section>
    )
}