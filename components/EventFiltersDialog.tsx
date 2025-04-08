"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type EventLocationTypeFilter = "all" | "in-person" | "online" | "hybrid";

interface FiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedType: EventLocationTypeFilter;
  onApply: (type: EventLocationTypeFilter) => void;
  onClear: () => void;
}

export default function EventFiltersDialog({
  open,
  onOpenChange,
  selectedType,
  onApply,
  onClear,
}: FiltersDialogProps) {

  const [tempType, setTempType] = useState<EventLocationTypeFilter>(selectedType);

  const handleApply = () => {
    onApply(tempType);
    onOpenChange(false);
  };

  const handleClear = () => {
    setTempType("all");
    onClear();
  };

  const onDialogOpen = (dialogOpen: boolean) => {
    onOpenChange(dialogOpen);
    setTempType(selectedType);
  }

  return (
    <Dialog open={open} onOpenChange={(dialogOpen) => onDialogOpen(dialogOpen)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Events</DialogTitle>
          <p className="text-sm text-gray-500">Filter events by location and type</p>
        </DialogHeader>

        <div>
          <p className="font-medium text-sm mb-1">Location</p>
          <div className="border px-4 py-3 rounded-md text-gray-500 text-sm">Select states</div>
        </div>

        <div className="mt-4">
          <p className="font-medium text-sm mb-1">Event Type</p>
          <RadioGroup value={tempType} onValueChange={(val) => setTempType(val as EventLocationTypeFilter)} className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <label htmlFor="all">All Events</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-person" id="in-person" />
              <label htmlFor="in-person">In-Person</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" />
              <label htmlFor="online">Online</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hybrid" id="hybrid" />
              <label htmlFor="hybrid">Hybrid</label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleClear}>Clear Filters</Button>
          <Button className="bg-[#1C2329] hover:bg-[#0e3b69] text-white" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
