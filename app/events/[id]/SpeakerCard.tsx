import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, User } from "lucide-react";
import Link from "next/link";

export default function SpeakerCard({ speaker }) {
    if (!speaker) return null;

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    {speaker.photo_url ? (
                        <img
                            src={speaker.photo_url}
                            alt={speaker.name}
                            className="w-20 h-20 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                            <User size={30} className="text-blue-600" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                            {speaker.name}
                        </h3>
                        {speaker.title && (
                            <p className="text-gray-600 line-clamp-2">
                                {speaker.title}
                            </p>
                        )}
                        {speaker.affiliation && (
                            <p className="text-gray-600 line-clamp-2">
                                {speaker.affiliation}
                            </p>
                        )}
                        {speaker.bio && (
                            <p className="text-gray-600 line-clamp-2">
                                {speaker.bio}
                            </p>
                        )}
                        {speaker.role && (
                            <Badge variant="secondary" className="mt-2">
                                {speaker.role}
                            </Badge>
                        )}
                    </div>
                </div>
                {speaker.bio && (
                    <p className="mt-4 text-gray-600 text-sm">{speaker.bio}</p>
                )}
                {(speaker.url || speaker.twitter) && (
                    <div className="flex gap-2 mt-4">
                        {speaker.url && (
                            <Link href={speaker.url} target="_blank">
                                <Button variant="outline" size="sm">
                                    <Globe className="w-4 h-4 mr-2" />
                                    Website
                                </Button>
                            </Link>
                        )}
                        {speaker.twitter && (
                            <Link
                                href={`https://twitter.com/${speaker.twitter}`}
                                target="_blank"
                            >
                                <Button variant="outline" size="sm">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    Twitter
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
