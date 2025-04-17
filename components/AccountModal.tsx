"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";
import ProfilePage from "./ProfilePage";
import BillingPage from "./BillingPage";
import { useAccountModal } from "@/app/contexts/AccountModalContext";

export default function AccountModal() {

    const { open, setOpen, tab, setTab } = useAccountModal()

    const handleChange = (open: boolean) => {
        if (!open) {
          setTab("profile");
        }
        setOpen(open);
    };

    return (
        <Dialog open={open} 
                onOpenChange={handleChange}
        >
            <VisuallyHidden><DialogTitle/></VisuallyHidden>
            <DialogContent className="max-w-[60%] max-h-[80vh] p-0 flex flex-col overflow-hidden">
                <div className="w-full bg-white rounded-xl flex flex-col flex-1 overflow-hidden">
                    <div className="border-b px-6 py-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">My Account</h2>
                    </div>

                    <Tabs
                        value={tab}
                        onValueChange={(val) => setTab(val as any)}
                        defaultValue="profile"
                        className="w-full flex flex-col flex-1 overflow-hidden"
                        onKeyDownCapture={(e) => {
                            if (
                            e.key === "ArrowLeft" ||
                            e.key === "ArrowRight" ||
                            e.key === "Home" ||
                            e.key === "End"
                            ) {
                            e.preventDefault();
                            e.stopPropagation();
                            }
                        }}
                    >
                        <TabsList className="grid grid-cols-2 bg-white border-b rounded-none shadow-none w-full p-0">
                            <TabsTrigger
                                value="profile"
                                className="w-full h-full bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-[#113663] data-[state=active]:shadow-none shadow-none outline-none ring-0 focus-visible:ring-0 focus:ring-0 focus-visible:outline-none"
                            >
                                Profile Details
                            </TabsTrigger>
                            <TabsTrigger
                                value="billing"
                                className="w-full h-full bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-[#113663] data-[state=active]:shadow-none shadow-none outline-none ring-0 focus-visible:ring-0 focus:ring-0 focus-visible:outline-none"
                            >
                                Billing and Payments
                            </TabsTrigger>
                        </TabsList>
                        
                        <div className="w-full overflow-y-auto px-0 py-0 flex-1">
                            <TabsContent value="profile">
                                <ProfilePage/>
                            </TabsContent>

                            <TabsContent value="billing">
                                <BillingPage/>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
