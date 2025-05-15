"use client";

import { Globe } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MarkdownEditor } from "./markdown-editor"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react";
import { BasicInfoValues } from "./BasicInfoSection";

export interface MetaInfoProps {
  title: BasicInfoValues["title"];
  briefDescription: BasicInfoValues["briefDescription"];
  description: BasicInfoValues["description"];
  url: BasicInfoValues["url"];
  organizationId: BasicInfoValues["organizationId"];
  onChange: (
    fields: Partial<
      Pick<
        BasicInfoValues,
        | "title"
        | "briefDescription"
        | "description"
        | "url"
        | "organizationId"
      >
    >
  ) => void;
}

export default function MetaInfo({
    title,
    briefDescription,
    description,
    url,
    organizationId,
    onChange,} : MetaInfoProps
){

    const [organizations, setOrganizations] = useState<Organization[]>([])
    const [fetching, setFetching] = useState(true)
        
    async function fetchOrganizations() {
        const response = await fetch(`/api/organizations`)
        if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
        }
        const data = await response.json()
        setOrganizations(data.organizations)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
            setFetching(true)
            await fetchOrganizations()
            } catch (error) {
            console.error("Error fetching organizations:", error)
            } finally {
            setFetching(false)
            }
        }
        fetchData()
        }, [])

    return(
        <div className="space-y-6">
            <div>
                <Label htmlFor="event-title" className="text-sm font-medium mb-1 block">
                    Event Title<span className="text-red-500">*</span>
                </Label>
                <Input
                    id="event-title"
                    placeholder="Enter event title"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({title: e.target.value})}
                />
            </div>

            {/* Brief Description */}
            <div>
                <Label htmlFor="brief-description" className="text-sm font-medium mb-1 block">
                    Brief Description
                </Label>
                <Input
                    id="brief-description"
                    placeholder="A short summary of your event (displayed in event cards)"
                    value={briefDescription}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({briefDescription: e.target.value})}
                />
            </div>

            {/* Full Description */}
            <div>
                <Label htmlFor="description" className="text-sm font-medium mb-1 block">
                    Full Description<span className="text-red-500">*</span>
                </Label>
                <MarkdownEditor
                    value={description}
                    onChange={(markdown: string) => onChange({ description: markdown })}
                />
            </div>

            {/* URL */}
            <div>
                <Label htmlFor="url" className="text-sm font-medium mb-1 block">
                    Event URL<span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                    <Input
                        id="url"
                        placeholder="https://example.com/event"
                        value={url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({url: e.target.value})}
                        className="pl-10"
                    />
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="organization" className="text-sm font-medium mb-1 block">
                    Organization<span className="text-red-500">*</span>
                </label>
                {fetching ? (
                    <div className="text-gray-500">Loading organizations…</div>
                ) : (
                    <Select value={organizationId} onValueChange={(val) => onChange({organizationId: val})}>
                    <SelectTrigger
                        className="
                            w-[20rem] h-9 bg-white rounded-md max-sm:w-full
                            border border-gray-300
                            focus:outline-none focus:border-none
                            focus:ring-2 focus:ring-[#47ADFF]
                        "
                    >
                        <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectGroup>
                        <SelectLabel>Select Organization</SelectLabel>
                        <SelectItem value="all">All Organizations</SelectItem>
                        {organizations.map((org) => (
                            <SelectItem key={org._id} value={org._id}>
                            {org.name}
                            </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    )
}