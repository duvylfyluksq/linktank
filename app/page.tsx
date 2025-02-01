"use client";

import { Button } from "@/components/ui/button";
import { Bell, Check, TrendingUp, Users, Wand } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const features = [
    {
        title: "One Place for Events",
        description: "No more missing out or tracking multiple event listings.",
        icon: Bell,
    },
    {
        title: "Expand Your Network",
        description:
            "Discover new organizations and connect with experts in your field.",
        icon: Users,
    },
    {
        title: "Stay Ahead of the Curve",
        description:
            "Be the first to know about the latest research and policy debates.",
        icon: TrendingUp,
    },
    {
        title: "Deepen Your Understanding",
        description:
            "Engage with thought leaders and gain insights on critical global issues.",
        icon: Wand,
    },
];

const images1 = [
    "/landing-2-1.jpg",
    "/landing-2-2.jpg",
    "/landing-2-3.jpg",
    "/landing-2-4.jpg",
    "/landing-2-5.webp",
    "/landing-2-6.jpg",
];

const images2 = ["/landing-3-1.jpg", "/landing-3-2.jpg", "/landing-3-3.jpg"];

export default function Landing() {
    const [isYearly, setIsYearly] = useState(true);

    const price = isYearly ? "99.97" : "10.97";
    const period = isYearly ? "per year" : "per month";
    const billingText = isYearly ? "Billed yearly" : "Billed monthly";

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="h-[35.75rem] w-full bg-[#D1E7FD] flex flex-col items-center justify-center">
                <div className="w-[42.875rem] flex flex-col items-center gap-[1.625rem]">
                    <h1 className="text-[#113663] font-jakarta text-[2.5rem] font-extrabold text-center">
                        Discover Conversations Shaping the World
                    </h1>
                    <p className="text-[#1C2329] font-jakarta text-[1.25rem] text-center font-medium">
                        Find every think tank and policy event. Meet experts in
                        the know and never miss valuable insight.
                    </p>
                    <div className="flex flex-row gap-[0.56rem]">
                        <Button className="px-[3rem] rounded-[0.75rem] py-[1.7rem] bg-[#1C2329] text-white border-[#3F4749] border-[1px] font-inter font-medium text-[1.125rem]">
                            Get Started
                        </Button>
                        <Button className="px-[3rem] rounded-[0.75rem] py-[1.7rem] bg-transparent text-[#113663] hover:bg-transparent shadow-none font-inter font-semibold text-[1.125rem]">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
            <div className="h-[35.0625rem] bg-[#EDFAFF] w-full flex flex-col items-center justify-center">
                <div className="flex flex-row gap-[2.6875rem]">
                    <div className="flex flex-col gap-[1.625rem] w-[36.25rem]">
                        <h1 className="text-[#113663] font-jakarta text-[2rem] font-bold text-left">
                            Global Event Calendar & Curated Email Alerts
                        </h1>
                        <p className="text-[#1C2329] font-jakarta text-[1rem] text-left font-normal">
                            Access events from think tanks, research
                            institutions, and policy-focused organizations
                            worldwide. Find trending events and get notified
                            about what matters to you.
                        </p>
                        <Button className="px-[3rem] rounded-[0.75rem] py-[1.7rem] bg-[#1C2329] text-white border-[#3F4749] border-[1px] w-fit font-inter font-medium text-[1.125rem]">
                            Get Started
                        </Button>
                    </div>
                    <div className="grid gap-x-[1.09rem] gap-y-[1.4375rem] grid-cols-3 grid-rows-2">
                        {images1.map((image, index) => (
                            <div className="h-[9.64819rem] w-[9.64819rem] rounded-[1.25375rem]">
                                <Image
                                    key={`${image}-${index}`}
                                    src={image}
                                    alt=""
                                    width={100}
                                    height={100}
                                    className="h-full w-full object-cover rounded-[1.25375rem]"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-white h-[27.75rem] gap-[3rem] flex flex-col items-center justify-center">
                <h4 className="text-[#113663] font-jakarta text-[1.5rem] font-semibold text-center w-[36.25rem]">
                    Events and insights from organizations and experts shaping
                    conversations today
                </h4>
                <div className="flex flex-row gap-[1.3125rem]">
                    <Image
                        src="/rand.svg"
                        alt="RAND Organization Logo"
                        width={100}
                        height={100}
                        className="h-[4.9375rem] w-auto"
                    />
                    <Image
                        src="/Cato_Institute.svg"
                        alt="CATO Institute Logo"
                        width={100}
                        height={100}
                        className="h-[4.9375rem] w-auto"
                    />
                    <Image
                        src="/csis.jpg"
                        alt="Center for Strategic & Internation Studies Logo"
                        width={100}
                        height={100}
                        className="h-[4.9375rem] w-auto"
                    />
                </div>
            </div>
            <div className="h-[43rem] w-full bg-[#113663] flex flex-col items-center justify-center gap-[2.69rem]">
                <h3 className="text-center text-[#FAFEFF] font-jakarta text-[2rem] font-bold w-[33.25rem]">
                    Discover Insights and Connect with Experts
                </h3>
                <div className="grid grid-cols-2 gap-y-[2.5rem] gap-x-[2.06rem] w-[51.19rem]">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="flex flex-col gap-[0.5rem] bg-white rounded-[0.625rem] pl-[1.19rem] pr-[0.81rem] pt-[2rem] pb-[2.44rem]"
                        >
                            <div className="flex flex-row gap-[0.5rem]">
                                <feature.icon
                                    size={34}
                                    className="text-[#113663]"
                                />
                                <h4 className="text-[#113663] font-jakarta text-[1.5rem] font-bold tracking-[-0.0465rem]">
                                    {feature.title}
                                </h4>
                            </div>
                            <p className="text-[#113663] font-jakarta text-[1rem] font-normal tracking-[-0.01rem] leading-[1.4375rem]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-[31rem] bg-[#FAFEFF] w-full flex flex-col items-center justify-center">
                <div className="flex flex-row gap-[2.6875rem]">
                    <div className="flex flex-col gap-[1.625rem] w-[36.25rem]">
                        <h1 className="text-[#113663] font-jakarta text-[2rem] font-bold text-left">
                            Who's Linktank for?
                        </h1>
                        <p className="text-[#1C2329] font-jakarta text-[1rem] text-left font-normal">
                            Linktank is for policy professionals, issue
                            advocates, researchers, students, journalists,
                            business leaders—anyone interested in thoughtful
                            policy discussions.
                        </p>
                        <Button className="px-[3rem] rounded-[0.75rem] py-[1.7rem] bg-[#1C2329] text-white border-[#3F4749] border-[1px] w-fit font-inter font-medium text-[1.125rem]">
                            Get Started
                        </Button>
                    </div>
                    <div className="grid gap-x-[1.09rem] gap-y-[1.4375rem] grid-cols-3">
                        {images2.map((image, index) => (
                            <div className="h-[13.29413rem] w-[10.94063rem] rounded-[0.50888rem]">
                                <Image
                                    key={`${image}-${index}`}
                                    src={image}
                                    alt=""
                                    width={1000}
                                    height={1000}
                                    className="h-full w-full object-cover rounded-[0.50888rem]"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-[54.69rem] bg-[#D1E7FD] w-full flex flex-col items-center justify-center">
                <h1 className="text-[#113663] text-4xl font-bold text-center mb-[1.25rem]">
                    One subscription. Full access.
                </h1>

                <div className="inline-flex items-center rounded-full border p-1 mb-8 bg-white">
                    <button
                        onClick={() => setIsYearly(true)}
                        className={`px-[2.5rem] py-2 rounded-full text-[1.125rem] transition-colors h-[3.3125rem] ${
                            isYearly
                                ? "bg-[#14284B] text-white"
                                : "text-gray-600"
                        }`}
                    >
                        Yearly
                    </button>
                    <button
                        onClick={() => setIsYearly(false)}
                        className={`px-[2.5rem] py-2 rounded-full text-[1.125rem] transition-colors h-[3.3125rem] ${
                            !isYearly
                                ? "bg-[#14284B] text-white"
                                : "text-gray-600"
                        }`}
                    >
                        Monthly
                    </button>
                </div>

                <p className="text-[#113663] text-[1.5rem] mb-[2.25rem] font-semibold">
                    Save 25% when billed annually!
                </p>

                <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
                    <p className="text-[1.125rem] font-semibold text-gray-600 mb-[1.5rem]">
                        {billingText}
                    </p>
                    <h2 className="text-4xl font-bold text-[#14284B] mb-8">
                        ${price}{" "}
                        <span className="text-xl font-normal">{period}</span>
                    </h2>

                    <div className="space-y-4 mb-8 text-[1rem]">
                        <div className="flex items-center">
                            <Check className="h-5 w-5 text-[#14284B] mr-2" />
                            <span>1 Project</span>
                        </div>
                        <div className="flex items-center">
                            <Check className="h-5 w-5 text-[#14284B] mr-2" />
                            <span>2 Pages per project</span>
                        </div>
                        <div className="flex items-center">
                            <Check className="h-5 w-5 text-[#14284B] mr-2" />
                            <span>1 Workspace</span>
                        </div>
                        <div className="flex items-center">
                            <Check className="h-5 w-5 text-[#14284B] mr-2" />
                            <span>Guest Commenting</span>
                        </div>
                    </div>

                    <Button className="w-full bg-[#1C2329] hover:bg-[#151a1f] text-white h-[3.75rem] text-[1.125rem] rounded-[0.75rem]">
                        Get started
                    </Button>
                </div>
            </div>
        </div>
    );
}
