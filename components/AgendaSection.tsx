"use client";

import { useState } from "react";
import Section from "./section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { TimePicker } from "./time-picker";

interface AgendaItem {
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}
interface DayAgenda {
  items: AgendaItem[];
}

export default function AgendaSection() {
    const [dayAgendas, setDayAgendas] = useState<DayAgenda[]>([]);
    const [selectedDay, setSelectedDay] = useState(-1);

    const addDay = () => {
        setDayAgendas(prev => [...prev, { items: [] }]);
        setSelectedDay(prev => prev + 1);
    };

    const removeDay = (dayIndex: number) => {
        setDayAgendas((days) => days.filter((_, idx) => idx !== dayIndex));
        setSelectedDay((prevSelected) => {
            if (dayIndex === prevSelected) {
                return prevSelected - 1;
            }
            return prevSelected;
        });
    };

    const addAgendaItem = (dayIndex: number) => {
        setDayAgendas((prev) =>
            prev.map((day, idx) =>
            idx !== dayIndex
                ? day
                : {
                    ...day,
                    items: [
                    ...day.items,
                    { startTime: "", endTime: "", title: "", description: "" },
                    ],
                }
            )
        );
    };


    const removeAgendaItem = (dayIndex: number, itemIndex: number) => {
        setDayAgendas((prev) =>
            prev.map((day, idx) =>
                idx !== dayIndex
                ? day
                : {
                    ...day,
                    items: day.items.filter((_, i) => i !== itemIndex),
                }
            )
        );
    };


    const updateAgendaItem = (
        dayIndex: number,
        itemIndex: number,
        field: keyof AgendaItem,
        value: string
    ) => {
        setDayAgendas(prev =>
            prev.map((day, di) =>
            di !== dayIndex
                ? day
                : {
                    ...day,
                    items: day.items.map((item, ii) =>
                    ii !== itemIndex
                        ? item
                        : { ...item, [field]: value }
                    ),
                }
            )
        );
    };


  return (
    <Section title="Agenda">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">Create your event schedule</p>
        <Button variant="outline" size="sm" onClick={addDay}>
          <Plus className="h-4 w-4 mr-2" />
          Add Day
        </Button>
      </div>

      <Tabs
        value={dayAgendas.length > 0 ? `day-${selectedDay}` : undefined}
        onValueChange={(val) => {
          const idx = parseInt(val.replace("day-", ""), 10);
          setSelectedDay(idx);
        }}
        className="w-full"
      >
        <TabsList className="mb-4 flex flex-wrap">
          {dayAgendas.map((_, dayIndex) => (
            <TabsTrigger
              key={dayIndex}
              value={`day-${dayIndex}`}
              className="flex items-center"
            >
              Day {dayIndex + 1}
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  removeDay(dayIndex);
                }}
                className="ml-2 h-6 w-6 p-0 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </TabsTrigger>
          ))}
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
              {day.items.map((item, itemIndex) => (
                <div
                  key={`day-${dayIndex}-item-${itemIndex}`}
                  className="border rounded-md p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-xs text-gray-500">
                      Agenda Item {itemIndex + 1}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAgendaItem(dayIndex, itemIndex)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">
                        Title
                      </Label>
                      <Input
                        placeholder="e.g., Welcome & Introduction"
                        value={item.title}
                        onChange={e =>
                          updateAgendaItem(
                            dayIndex,
                            itemIndex,
                            "title",
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
                        value={item.description}
                        onChange={e =>
                          updateAgendaItem(
                            dayIndex,
                            itemIndex,
                            "description",
                            e.target.value
                          )
                        }
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="flex gap-2">
                        <TimePicker
                            time={item.startTime}
                            setTime={(t) => updateAgendaItem(dayIndex, itemIndex, "startTime", t)}
                            placeholder="Select start time"
                            className="flex-1"
                        />
                        <TimePicker
                            time={item.endTime}
                            setTime={(t) => updateAgendaItem(dayIndex, itemIndex, "endTime", t)}
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



