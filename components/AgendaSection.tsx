"use client";

import { useEffect, useRef, useState } from "react";
import Section from "./section";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/time-picker";


export interface AgendaSectionProps {
  value: DayAgenda[];
  onChange: (newValue: DayAgenda[]) => void;
}

export default function AgendaSection({
  value: dayAgendas,
  onChange,
}: AgendaSectionProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const prevLength = useRef(dayAgendas.length);

  useEffect(() => {
    if (dayAgendas.length > prevLength.current) {
      setSelectedDay(dayAgendas.length - 1);
    }
    prevLength.current = dayAgendas.length;
  }, [dayAgendas.length]);

  const formatTime = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const parseTimeStringToDate = (time: string): Date => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const addDay = () => {
    const newItem: AgendaItem = {
      start_time: new Date(),
      end_time: new Date(),
      topic: "",
      brief_description: "",
      speakers: [],
    };
    onChange([...dayAgendas, { items: [newItem] }]);
  };

  const removeDay = (dayIndex: number) => {
    const newDays = dayAgendas.filter((_, i) => i !== dayIndex);
    onChange(newDays);
    setSelectedDay((prev) =>
      dayIndex <= prev ? Math.max(prev - 1, 0) : prev
    );
  };

  const addAgendaItem = (dayIndex: number) => {
    const newItem: AgendaItem = {
      start_time: new Date(),
      end_time: new Date(),
      topic: "",
      brief_description: "",
      speakers: [],
    };
    const newDays = dayAgendas.map((day, i) =>
      i !== dayIndex
        ? day
        : { ...day, items: [...day.items, newItem] }
    );
    onChange(newDays);
  };

  const removeAgendaItem = (dayIndex: number, itemIndex: number) => {
    const newDays = dayAgendas.map((day, i) =>
      i !== dayIndex
        ? day
        : {
            ...day,
            items: day.items.filter((_, j) => j !== itemIndex),
          }
    );
    onChange(newDays);
  };

  const updateAgendaItem = (
    dayIndex: number,
    itemIndex: number,
    field: keyof AgendaItem,
    value: string
  ) => {
    const newDays = dayAgendas.map((day, di) =>
      di !== dayIndex
        ? day
        : {
            ...day,
            items: day.items.map((item, ii) =>
              ii !== itemIndex
                ? item
                : {
                    ...item,
                    [field]:
                      field === "start_time" || field === "end_time"
                        ? (parseTimeStringToDate(value) as any)
                        : value,
                  }
            ),
          }
    );
    onChange(newDays);
  };

  return (
    <Section title="Agenda">
      <p className="text-sm text-gray-500 mb-4">
        Create your event schedule
      </p>

      <Tabs
        value={dayAgendas.length ? `day-${selectedDay}` : undefined}
        onValueChange={(val) => {
          setSelectedDay(parseInt(val.replace("day-", ""), 10));
        }}
        className="w-full"
      >
        <TabsList className="mb-4 flex items-center justify-start space-x-2">
          {dayAgendas.map((_, dayIndex) => (
            <TabsTrigger
              key={dayIndex}
              value={`day-${dayIndex}`}
              className="flex items-center h-10 px-3"
            >
              Day {dayIndex + 1}
              <Button
                variant="ghost"
                size="icon"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeDay(dayIndex);
                }}
                className="ml-1 h-6 w-6 p-0 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </TabsTrigger>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={addDay}
            className="h-10 w-10 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </TabsList>

        {dayAgendas.map((day, dayIndex) => (
          <TabsContent
            key={`day-content-${dayIndex}`}
            value={`day-${dayIndex}`}
            className="space-y-4"
          >
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addAgendaItem(dayIndex)}
                className="ml-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {day.items.map((item, idx) => (
                <div
                  key={`day-${dayIndex}-item-${idx}`}
                  className="border rounded-md p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-xs text-gray-500">
                      Agenda Item {idx + 1}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAgendaItem(dayIndex, idx)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">
                        Topic
                      </Label>
                      <Input
                        placeholder="e.g., Welcome & Introduction"
                        value={item.topic}
                        onChange={(e) =>
                          updateAgendaItem(
                            dayIndex,
                            idx,
                            "topic",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">
                        Brief Description
                      </Label>
                      <Textarea
                        placeholder="Brief description of this agenda item"
                        value={item.brief_description}
                        onChange={(e) =>
                          updateAgendaItem(
                            dayIndex,
                            idx,
                            "brief_description",
                            e.target.value
                          )
                        }
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <TimePicker
                        time={formatTime(item.start_time)}
                        setTime={(t) =>
                          updateAgendaItem(
                            dayIndex,
                            idx,
                            "start_time",
                            t
                          )
                        }
                        placeholder="Select start time"
                        className="flex-1"
                      />
                      <TimePicker
                        time={formatTime(item.end_time)}
                        setTime={(t) =>
                          updateAgendaItem(
                            dayIndex,
                            idx,
                            "end_time",
                            t
                          )
                        }
                        placeholder="Select end time"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
}
