"use client";

import Section from "./section";
import DateLocation from "./DateLocationInfo";
import EventImage from "./EventImage";
import MetaInfo from "./MetaInfo";


export default function BasicInfoSection(){
    return(
        <>
          <Section title="Basic Information">
            <div className="flex flex-col md:flex-row gap-6">
              <EventImage/>
              <div className="flex-1">
                  <MetaInfo/>
                  <DateLocation/>
              </div>
            </div>
          </Section>
        </>
    );
}