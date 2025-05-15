"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/date-picker";
import { TimePicker } from "@/components/time-picker";
import { Globe, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BasicInfoValues } from "./BasicInfoSection";

export interface DateLocationInfoProps {
  startDate: BasicInfoValues["startDate"];
  startTime?: BasicInfoValues["startTime"];
  endDate?: BasicInfoValues["endDate"];
  endTime?: BasicInfoValues["endTime"];
  isDateRange: BasicInfoValues["isDateRange"];
  isVirtual: BasicInfoValues["isVirtual"];
  isInPerson: BasicInfoValues["isInPerson"];
  location: BasicInfoValues["location"];
  meetingUrl?: BasicInfoValues["meetingUrl"];
  onChange: (
    fields: Partial<
      Pick<
        BasicInfoValues,
        | "startDate"
        | "startTime"
        | "endDate"
        | "endTime"
        | "isDateRange"
        | "isVirtual"
        | "isInPerson"
        | "location"
        | "meetingUrl"
      >
    >
  ) => void;
}

export default function DateLocation({
  startDate,
  startTime,
  endDate,
  endTime,
  isDateRange,
  isVirtual,
  isInPerson,
  location,
  meetingUrl,
  onChange,
}: DateLocationInfoProps) {
  return (
    <>
      <Separator className="my-6" />
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Event Date</Label>
          <div className="flex items-center">
            <Label htmlFor="is-date-range" className="text-xs mr-2">
              Date Range
            </Label>
            <Switch
              id="is-date-range"
              checked={isDateRange}
              onCheckedChange={(checked) =>
                onChange({ isDateRange: checked as boolean })
              }
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">
              Start Date &amp; Time<span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <DatePicker
                date={startDate}
                setDate={(date) => onChange({ startDate: date })}
                placeholder="Select start date"
              />
              {!isDateRange && (
                <TimePicker
                  time={startTime!}
                  setTime={(t) => onChange({ startTime: t })}
                  placeholder="Select start time"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-500">End Date &amp; Time</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <DatePicker
                date={endDate}
                setDate={(date) => onChange({ endDate: date })}
                placeholder="Select end date"
              />
              {!isDateRange && (
                <TimePicker
                  time={endTime!}
                  setTime={(t) => onChange({ endTime: t })}
                  placeholder="Select end time"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <Label className="text-sm font-medium mb-4 block">
          Event Location<span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-in-person"
                checked={isInPerson}
                onCheckedChange={(checked) =>
                  onChange({ isInPerson: checked as boolean })
                }
              />
              <Label htmlFor="is-in-person" className="text-sm">
                In Person
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-virtual"
                checked={isVirtual}
                onCheckedChange={(checked) =>
                  onChange({ isVirtual: checked as boolean })
                }
              />
              <Label htmlFor="is-virtual" className="text-sm">
                Virtual
              </Label>
            </div>
          </div>

          {isInPerson && (
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Physical Location</Label>
              <div className="relative">
                <Input
                  id="location"
                  placeholder="Physical location address"
                  value={location}
                  onChange={(e) => onChange({ location: e.target.value })}
                  className="pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          )}

          {isVirtual && (
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">
                Virtual Meeting Link
              </Label>
              <div className="relative">
                <Input
                  id="meeting-url"
                  placeholder="Virtual meeting link"
                  value={meetingUrl}
                  onChange={(e) => onChange({ meetingUrl: e.target.value })}
                  className="pl-10"
                />
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
