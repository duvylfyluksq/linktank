"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";
import ProfilePage from "./ProfilePage";
import BillingPage from "./BillingPage";
import { useAccountModal } from "@/app/contexts/AccountModalContext";

export default function AccountModal() {
  const { open, setOpen, tab, setTab } = useAccountModal();
  const handleChange = (open: boolean) => {
    if (!open) setTab("profile");
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <VisuallyHidden><DialogTitle /></VisuallyHidden>
      <DialogContent
        className="
          w-[90vw]            /* nearly-full width on mobile */
          max-h-[90vh]        /* cap at 90% of screen height */
          sm:max-w-[60%]      /* your old tablet/desktop width */
          sm:max-h-[80vh]     /* your old desktop height cap */
          p-0
          flex flex-col
          overflow-hidden     /* we’ll scroll the inner container */
        "
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* header */}
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Account</h2>
          </div>

          {/* tabs */}
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as any)}
            defaultValue="profile"
            className="flex flex-col flex-1 min-h-0"
            onKeyDownCapture={(e) => {
              if (["ArrowLeft","ArrowRight","Home","End"].includes(e.key)) {
                e.preventDefault(); e.stopPropagation();
              }
            }}
          >
            <TabsList className="grid grid-cols-2 bg-white border-b">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
            </TabsList>

            {/* this is the only thing that scrolls */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <TabsContent value="profile">
                <ProfilePage />
              </TabsContent>
              <TabsContent value="billing">
                <BillingPage />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
