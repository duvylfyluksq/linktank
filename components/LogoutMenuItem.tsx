import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

type LogoutMenuItemProps = HTMLAttributes<HTMLDivElement>;

export default function LogoutMenuItem({ className, ...props }: LogoutMenuItemProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isLoggingOut) {
    return (
      <div
        className={cn("flex items-center opacity-50 pointer-events-none", className)}
        {...props}
      >
        <LogOut className="mr-2 h-4 w-4 animate-spin" />
        Logging out...
      </div>
    );
  }

  return (
    <SignOutButton>
      <div
        className={cn("flex items-center cursor-pointer", className)}
        onClick={() => setIsLoggingOut(true)}
        {...props}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </div>
    </SignOutButton>
  );
}
