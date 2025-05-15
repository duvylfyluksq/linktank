"use client";

import Section from "./section";
import DateLocation from "./DateLocationInfo";
import EventImage from "./EventImage";
import MetaInfo from "./MetaInfo";

export interface BasicInfoValues {
  title: string;
  briefDescription: string;
  description: string;
  url: string;
  organizationId: string;
  photoUrl?: string;
  startDate: Date;
  startTime?: string;
  endDate?: Date;
  endTime?: string;
  isDateRange: boolean;
  isVirtual: boolean;
  isInPerson: boolean;
  location: string;
  meetingUrl?: string;
}

export default function BasicInfoSection({
  value,
  onChange,
}: {
  value: BasicInfoValues;
  onChange: (v: BasicInfoValues) => void;
}) {
    return(
        <>
          <Section title="Basic Information">
            <div className="flex flex-col md:flex-row gap-6">
              <EventImage
                photoUrl={value.photoUrl}
                onChange={(newUrl: string) =>
                  onChange({ ...value, photoUrl: newUrl })
                }
              />
              <div className="flex-1">
                  <MetaInfo
                    {...{
                      title: value.title,
                      briefDescription: value.briefDescription,
                      description: value.description,
                      url: value.url,
                      organizationId: value.organizationId,
                    }}
                    onChange={fields =>
                      onChange({ ...value, ...fields })
                    }
                  />
                  <DateLocation
                    startDate={value.startDate}
                    startTime={value.startTime}
                    endDate={value.endDate}
                    endTime={value.endTime}
                    isDateRange={value.isDateRange}
                    isVirtual={value.isVirtual}
                    isInPerson={value.isInPerson}
                    location={value.location}
                    meetingUrl={value.meetingUrl}
                    onChange={fields =>
                      onChange({ ...value, ...fields })
                    }
                  />
              </div>
            </div>
          </Section>
        </>
    );
}