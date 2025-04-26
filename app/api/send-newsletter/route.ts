import { NextResponse } from "next/server"
import { Resend } from "resend"
import { EmailTemplate } from "@/newsletter/email-template"
import dbConnect from "@/lib/dbConnect"
import Event from "@/models/Event"
import User from "@/models/User"
import Organization from "@/models/Organization"
import City from "@/models/City"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  await dbConnect()

  try {
    const now = new Date()
    const upcomingEvents = await Event.find({
      date_from: {
        $gte: now
      },
    })
      .populate({path: "organization", model: Organization})
      .populate({path: "location_tag", model: City})
      .sort({ date_from: 1 })
      .limit(10)
      .lean() as any;

    const subscribedUsers = await User.find({
      newsletter_subscribed: true,
    }).lean()

    if (!subscribedUsers.length) {
      return NextResponse.json({
        success: false,
        message: "No subscribed users found",
      })
    }

    // Send email to each subscribed user
    const emailPromises = subscribedUsers.map(async (user) => {
      try {
        await resend.emails.send({
          from: "newsletter@linktank.com",
          to: user.email,
          subject: "Linktank Weekly Events Roundup",
          react: EmailTemplate({ events: upcomingEvents }),
        })
        return { email: user.email, success: true }
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error)
        return { email: user.email, success: false, error }
      }
    })

    const results = await Promise.all(emailPromises)


    return NextResponse.json({
      success: true,
      message: `Weekly email sent to ${results.filter((r) => r.success).length} users`,
      results,
    })
  } catch (error) {
    console.error("Error sending weekly email:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send weekly email",
        error,
      },
      { status: 500 },
    )
  }
}
