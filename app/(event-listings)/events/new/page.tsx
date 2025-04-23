"use client"
// import { FormInput } from "@/components/formInput";
import { UploadIcon } from "lucide-react";

export default function NewEventPage() {
    return (
        <div className="flex flex-col items-start justify-center w-[69.1875rem] pt-[2.625rem] pb-[5.46rem] gap-[2.625rem]">
            <div className="flex flex-col gap-[0.25rem]">
                <h1 className="text-[2rem] font-extrabold font-jakarta text-[#323232]">Submit an event</h1>
                <p className="text-[1rem] opacity-70 text-[#323232] font-medium font-jakarta">Fill in the details to submit an event to Linktank’s directory</p>
            </div>
            <div className="flex flex-row gap-[3rem] w-full">
                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center w-[27.125rem] h-[26.4375rem] flex-shrink-0">
                    <div className="mb-2 p-2 rounded-full border">
                        <UploadIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="font-medium">Upload event image</h3>
                    <p className="text-sm text-gray-500">Click or drag and drop</p>
                </div>
                <div className="flex flex-col gap-[0.9375rem] w-full">
                    <h2 className="text-xl font-bold text-[#323232]">Basic Information</h2>
                    {/* <FormInput label="Event Title" placeholder="Title here" type="text" value="" onChange={(e) => { }} className="w-full" required />
                    <FormInput label="Event Location" placeholder="Short description of your event here" type="text" value="" onChange={(e) => { }} className="w-full" />
                    <FormInput label="Event Date" placeholder="Event URL" type="text" value="" onChange={(e) => { }} className="w-full" />
                    <FormInput label="Event Time" placeholder="Event Location" type="text" value="" onChange={(e) => { }} className="w-full" />
                    <FormInput label="Online Meeting URL" placeholder="Zoom, Google Meet, etc." type="text" value="" onChange={(e) => { }} className="w-full" /> */}
                </div>
            </div>
        </div>
    );
}

