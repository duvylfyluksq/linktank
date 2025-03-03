"use client";

import { Check } from "lucide-react";
import { useState } from "react";

export default function SubscriptionPage() {
	const [billingCycle, setBillingCycle] = useState<"yearly" | "monthly">(
		"yearly",
	);

	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: "url(/authwall.png)",
					transform: "scale(1.1)",
					backgroundColor: "rgba(17, 54, 99, 0.71)",
					backgroundBlendMode: "overlay",
				}}
			/>
			<div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-16">
				<div className="flex flex-col items-center">
					<div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full max-sm:h-16 max-sm:w-16">
						{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
						<svg
							width="79"
							height="78"
							viewBox="0 0 79 78"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M39.0977 78C60.6908 78 78.1955 60.5391 78.1955 39C78.1955 17.4609 60.6908 0 39.0977 0C17.5047 0 0 17.4609 0 39C0 60.5391 17.5047 78 39.0977 78Z"
								fill="url(#paint0_linear_360_3106)"
							/>
							<path
								d="M47.5827 37.738V32.8157C47.5827 28.2848 43.9097 24.6118 39.3788 24.6118C34.8479 24.6118 31.1749 28.2848 31.1749 32.8157V37.738M32.4875 54.1458H46.2701C49.0268 54.1458 50.4052 54.1458 51.4582 53.6093C52.3844 53.1374 53.1374 52.3844 53.6093 51.4582C54.1458 50.4052 54.1458 49.0268 54.1458 46.2701V45.6138C54.1458 42.857 54.1458 41.4786 53.6093 40.4257C53.1374 39.4995 52.3844 38.7465 51.4582 38.2745C50.4052 37.738 49.0268 37.738 46.2701 37.738H32.4875C29.7308 37.738 28.3524 37.738 27.2995 38.2745C26.3733 38.7465 25.6202 39.4995 25.1483 40.4257C24.6118 41.4786 24.6118 42.857 24.6118 45.6138V46.2701C24.6118 49.0268 24.6118 50.4052 25.1483 51.4582C25.6202 52.3844 26.3733 53.1374 27.2995 53.6093C28.3524 54.1458 29.7308 54.1458 32.4875 54.1458Z"
								stroke="white"
								strokeWidth="3.28155"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<defs>
								<linearGradient
									id="paint0_linear_360_3106"
									x1="39.0977"
									y1="0"
									x2="39.0977"
									y2="78"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#228BE0" />
									<stop offset="1" stopColor="#47ADFF" />
								</linearGradient>
							</defs>
						</svg>
					</div>

					<h1 className="mb-4 text-center text-4xl font-bold text-white max-sm:text-2xl">
						Subscribe to see events
					</h1>

					<p className="mb-8 max-w-2xl text-center text-lg text-white max-sm:text-base">
						Discover events from think tanks, research institutions, and
						policy-focused organizations worldwide and get notified about what
						matters to you.
					</p>

					<div className="mb-4 flex rounded-full bg-white p-1">
						<button
							type="button"
							className={`rounded-full px-8 py-3 text-base font-medium transition-colors ${
								billingCycle === "yearly"
									? "bg-[#0e3b69] text-white"
									: "bg-transparent text-gray-700"
							}`}
							onClick={() => setBillingCycle("yearly")}
						>
							Yearly
						</button>
						<button
							type="button"
							className={`rounded-full px-8 py-3 text-base font-medium transition-colors ${
								billingCycle === "monthly"
									? "bg-[#0e3b69] text-white"
									: "bg-transparent text-gray-700"
							}`}
							onClick={() => setBillingCycle("monthly")}
						>
							Monthly
						</button>
					</div>
					<p className="mb-6 text-center text-lg text-white">
						Save 25% when billed annually!
					</p>
					<div className="w-full max-w-md rounded-lg bg-white p-8">
						<div className="mb-6">
							<p className="mb-1 text-lg font-medium text-gray-700">
								Billed {billingCycle === "yearly" ? "annually" : "monthly"}
							</p>
							<h2 className="mb-6 text-4xl font-bold text-[#0e3b69]">
								{billingCycle === "yearly" ? "$99.97" : "$9.99"}
							</h2>
							<ul className="space-y-4">
								<li className="flex items-start">
									<Check className="mr-3 h-5 w-5 text-[#0e3b69]" />
									<span className="text-gray-700">All-In-One Event Access</span>
								</li>
								<li className="flex items-start">
									<Check className="mr-3 h-5 w-5 text-[#0e3b69]" />
									<span className="text-gray-700">
										Timely Alerts & Reminders
									</span>
								</li>
								<li className="flex items-start">
									<Check className="mr-3 h-5 w-5 text-[#0e3b69]" />
									<span className="text-gray-700">
										Grow Your Expert Network
									</span>
								</li>
								<li className="flex items-start">
									<Check className="mr-3 h-5 w-5 text-[#0e3b69]" />
									<span className="text-gray-700">Deeper Policy Insights</span>
								</li>
							</ul>
						</div>
						<button
							type="button"
							className="w-full rounded-md bg-[#1e293b] py-4 text-center text-base font-medium text-white transition-colors hover:bg-[#0e3b69]"
						>
							Get started
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
