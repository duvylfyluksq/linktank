import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { ChevronLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
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

          <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">1. Introduction</h2>
              <p>
                At Linktank, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you use our service. Please read this privacy policy carefully. If
                you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">2. Information We Collect</h2>
              <p className="mb-2">We collect information that you provide directly to us when you:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Register for an account</li>
                <li>Fill in forms on our platform</li>
                <li>Correspond with us</li>
                <li>Subscribe to our newsletters or updates</li>
                <li>Participate in our promotions or surveys</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">3. How We Use Your Information</h2>
              <p className="mb-2">We may use the information we collect from you for various purposes, including to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Develop new products and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">4. Sharing Your Information</h2>
              <p>
                We may share your personal information with third parties only in the ways that are described in this
                privacy policy. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">5. Data Security</h2>
              <p>
                We have implemented appropriate technical and organizational security measures designed to protect the
                security of any personal information we process. However, please also remember that we cannot guarantee
                that the internet itself is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">6. Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, such as the
                right to request access to your data, correction of your data, deletion of your data, restriction of
                processing, and data portability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">7. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-[#1C2329]">8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:privacy@linktank.com" className="text-[#1C2329] hover:text-[#0e3b69] underline">
                  privacy@linktank.com
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
