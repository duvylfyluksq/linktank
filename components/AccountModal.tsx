"use client";

import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

export default function AccountModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user } = useUser() as any;
//   const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[60%] max-h-[80vh] p-0 flex flex-col overflow-hidden">
        <div className="w-full bg-white rounded-xl flex flex-col flex-1 overflow-hidden">
            <div className="border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Account</h2>
            </div>

            <Tabs 
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
                        <div className="grid grid-cols-3 px-3 py-4 gap-x-6 gap-y-6 items-center w-full">

                            <div className="text-sm text-gray-600">Profile</div>
                            <div className="flex items-center gap-2 truncate">
                                <img
                                    src={user?.imageUrl || ""}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <p className="font-medium text-sm text-black truncate">{user?.fullName}</p>
                            </div>
                            <Button
                                size="sm"
                                className="w-36 justify-self-end whitespace-nowrap flex items-center gap-1 bg-black text-white hover:bg-[#113663]"
                            >
                                <Pencil className="w-3 h-3"/>
                                Update profile
                            </Button>

                            <div className="text-sm text-gray-600">Email</div>
                            <div className="truncate text-sm">{user?.primaryEmailAddress?.emailAddress}</div>
                            <div/>

                            <div className="text-sm text-gray-600">Password</div>
                            <div className="text-sm"></div>
                            <Button
                                size="sm"
                                className="w-36 justify-self-end whitespace-nowrap flex items-center gap-1 bg-black text-white hover:bg-[#113663]"
                            >
                                Reset password
                            </Button>

                            {user?.verifiedExternalAccounts?.length > 0 && (
                                <>
                                    <div className="text-sm text-gray-600">Connected Accounts</div>
                                    <div className="flex items-center gap-3">
                                        {user?.verifiedExternalAccounts?.map((account, idx) => (
                                            <div className="flex items-center gap-1" key={idx}>
                                                <img
                                                    src={`/${account.provider}.svg`}
                                                    alt={account.provider}
                                                    width={20}
                                                    height={20}
                                                    className="object-contain"
                                                />
                                                <span>{account.provider.charAt(0).toUpperCase() + account.provider.slice(1)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div/>
                                </>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="billing">
                        <div className="p-6 space-y-6">
                            {/* Subscription Plan */}
                            <div className="border rounded-lg p-4 space-y-2">
                            <h3 className="text-sm font-medium">Select a plan</h3>
                            <p className="text-sm text-gray-500">Subscribe to access Linktank fully!</p>
                            <div className="flex flex-col gap-3 pt-2">
                                <button className="flex justify-between items-center border border-black rounded-md px-4 py-2 text-sm font-medium text-white bg-black hover:bg-[#113663] transition">
                                <span>Monthly</span>
                                <span>$15.00/month</span>
                                </button>
                                <button className="flex justify-between items-center border border-black rounded-md px-4 py-2 text-sm font-medium text-white bg-black hover:bg-[#113663] transition">
                                <span>
                                    Yearly <span className="ml-1 text-xs text-green-400">Save 15%</span>
                                </span>
                                <span>$12.75/month<br /><span className="text-xs text-gray-400">$139 annually</span></span>
                                </button>
                            </div>
                            </div>

                            {/* Payment Method */}
                            <div className="border rounded-lg p-4">
                            <h3 className="text-sm font-medium mb-1">Payment Method</h3>
                            <p className="text-sm text-gray-500 mb-2">Your default payment method</p>
                            <div className="bg-red-50 border border-red-200 text-red-500 rounded-md p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                <span className="text-xl">⚠️</span>
                                <span className="text-sm font-medium">Add a card to keep access!</span>
                                </div>
                                <button className="bg-black text-white px-3 py-1 rounded hover:bg-[#113663] text-sm">Add card</button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Renews MM/DD/YY</p>
                            </div>

                            {/* Billing History */}
                            <div>
                            <h3 className="text-sm font-medium mb-2">Billing History</h3>
                            <table className="w-full text-sm text-left border rounded-md overflow-hidden">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">Invoice</th>
                                    <th className="px-4 py-2">Amount</th>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Download</th>
                                </tr>
                                </thead>
                                <tbody>
                                {[
                                    { id: "#1", amount: "$15.00", date: "04/01/24", status: "Not Paid" },
                                    { id: "#2", amount: "$15.00", date: "03/01/24", status: "Paid" },
                                    { id: "#3", amount: "$15.00", date: "02/01/24", status: "Paid" }
                                ].map((item, i) => (
                                    <tr key={i} className="border-t">
                                    <td className="px-4 py-2">{item.id}</td>
                                    <td className="px-4 py-2">{item.amount}</td>
                                    <td className="px-4 py-2">{item.date}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                        {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button className="text-blue-600 hover:underline text-sm">
                                            <img
                                                src="/download.svg"
                                            />
                                        </button>
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <button className="mt-4 text-sm px-4 py-2 border rounded-md">Cancel Subscription</button>
                            </div>
                        </div>
                    </TabsContent>
                </div>

                
            </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
