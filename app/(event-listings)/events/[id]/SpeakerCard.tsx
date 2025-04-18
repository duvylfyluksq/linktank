import React from "react";
import Image from "next/image";
import { FaXTwitter, FaLinkedinIn, FaGlobe } from "react-icons/fa6";


export default function SpeakerCard({ speaker }) {
    if (!speaker) return null;

    return (
        <div
        key={speaker.name}
        className="border border-black border-opacity-15 bg-white rounded-[0.75rem] p-4 flex flex-row gap-[0.8125rem] items-center transition-shadow duration-300 ease-in-out hover:shadow-md hover:shadow-gray-300"
        >
            <Image
                src={
                    speaker.photo_url ||
                    "/user.svg"
                }
                alt={`${speaker.name} image`}
                width={1000}
                height={1000}
                className="h-[4.25rem] w-[4.25rem] rounded-full object-cover flex-shrink-0"
            />
            <div className="flex flex-col h-full justify-center gap-2">
                <h3 className="text-[#1C2329] font-semibold text-base font-jakarta">
                    {speaker.name}
                </h3>
                {speaker.title && (
                    <p className="text-[#71717A] text-sm font-jakarta"
                        dangerouslySetInnerHTML={{
                            __html: speaker.title
                        }}
                    >
                    </p>
                )}   
                <div className="flex flex-row items-center gap-2">
                    {speaker.url && (
                        <a
                            href={speaker.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGlobe size={16} className="text-[#71717A] hover:text-[#1C2329]" />
                        </a>
                    )}
                    {speaker.twitter && (
                        <a
                            href={`https://twitter.com/${speaker.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaXTwitter size={16} className="text-[#71717A] hover:text-[#1C2329]" />
                        </a>
                    )}
                    {speaker.linkedin && (
                        <a
                            href={speaker.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaLinkedinIn size={16} className="text-[#71717A] hover:text-[#1C2329]" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
