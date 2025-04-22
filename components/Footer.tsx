import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-[#113663] w-full text-white py-[1.25rem] px-5 sm:px-[5.13rem] font-jakarta items-center justify-center">
            <div className="flex w-full flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 w-full">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/linktank_logo.png"
                            alt="LinkTank"
                            width={100}
                            height={100}
                            className="w-10 h-10 mr-[0.625rem] rounded-full"
                        />

                        <span className="text-2xl font-bold mr-[2.44rem]">
                            LinkTank
                        </span>
                    </Link>
                    <p className="text-sm mt-4 text-gray-400">
                        © 2025 Linktank. All rights reserved
                    </p>
                </div>
                <div className="flex flex-row gap-[0.81rem] w-full sm:justify-end">
                    <div className="flex flex-col gap-[1.5rem]">
                        <div>
                            <Link
                                href="/events"
                                className="text-sm hover:text-gray-300"
                            >
                                Events
                            </Link>
                        </div>
                        {/* <div>
                            <Link
                                href="/experts"
                                className="text-sm hover:text-gray-300"
                            >
                                Experts
                            </Link>
                        </div> */}
                        <div>
                            <Link
                                href="/organizations"
                                className="text-sm hover:text-gray-300"
                            >
                                Organizations
                            </Link>
                        </div>

                        <div>
                            <Link
                                href="/my-calendar"
                                className="text-sm hover:text-gray-300"
                            >
                                My Calendar
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[1.5rem]">
                        <div>
                            <Link
                                href="/privacy-policy"
                                className="text-sm hover:text-gray-300"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                        <div>
                            <Link
                                href="/terms-of-service"
                                className="text-sm hover:text-gray-300"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
