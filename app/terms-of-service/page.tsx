import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { ChevronLeft } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#D1E7FD] py-10 px-4 w-full">
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="flex items-center justify-center px-6 pt-8">
          <Image
            src="/linktank_logo.png"
            alt="Linktank"
            width={100}
            height={100}
            className="w-12 h-12 mr-3 rounded-full"
          />
          <span className="text-2xl font-bold">Linktank</span>
        </div>

        <div className="p-8">
          {/* <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-1 text-[#1C2329] hover:text-[#0e3b69] p-0">
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </Link>
          </div> */}

          <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Linktank&apos;s services, you agree to be bound by these Terms of Service. If you
                disagree with any part of the terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">2. Description of Service</h2>
              <p>
                Linktank provides a platform for users to connect, share, and discover professional opportunities. We
                reserve the right to modify or discontinue, temporarily or permanently, the service with or without
                notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">3. User Accounts</h2>
              <p className="mb-2">
                When you create an account with us, you must provide accurate, complete, and current information. You
                are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Maintaining the confidentiality of your account and password</li>
                <li>Restricting access to your computer or mobile device</li>
                <li>All activities that occur under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">4. User Content</h2>
              <p>
                You retain all rights to any content you submit, post, or display on or through the service. By
                submitting, posting, or displaying content, you grant us a worldwide, non-exclusive, royalty-free
                license to use, reproduce, adapt, publish, translate, and distribute your content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">5. Prohibited Activities</h2>
              <p className="mb-2">You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violating laws or regulations</li>
                <li>Infringing on the intellectual property rights of others</li>
                <li>Transmitting harmful code or materials</li>
                <li>Harassing, abusing, or harming another person</li>
                <li>Impersonating another user or person</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">6. Limitation of Liability</h2>
              <p>
                In no event shall Linktank, its directors, employees, partners, agents, suppliers, or affiliates, be
                liable for any indirect, incidental, special, consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">7. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">8. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By
                continuing to access or use our service after those revisions become effective, you agree to be bound by
                the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
                <br />
                <a href="mailto:legal@linktank.com" className="text-[#1C2329] hover:text-[#0e3b69] underline">
                  legal@linktank.com
                </a>
              </p>
            </section>

            <div className="text-center pt-6 text-sm text-gray-500">Last Updated: April 17, 2025</div>
          </div>
        </div>
      </div>
    </div>
  )
}
