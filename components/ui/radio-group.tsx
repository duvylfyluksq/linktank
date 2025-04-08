"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

const RadioGroup = RadioGroupPrimitive.Root;

const RadioGroupItem = ({ className, ...props }: RadioGroupPrimitive.RadioGroupItemProps) => (
  <RadioGroupPrimitive.Item
    {...props}
    className={cn(
      "h-4 w-4 rounded-full border border-gray-400 bg-white data-[state=checked]:border-black relative transition-colors focus:outline-none",
      className
    )}
  >
    <RadioGroupPrimitive.Indicator className="absolute inset-1 flex items-center justify-center">
      <div className="aspect-square w-2 rounded-full bg-black"/>
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
);

export { RadioGroup, RadioGroupItem };
