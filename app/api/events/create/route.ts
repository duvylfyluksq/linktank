import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import Speaker from "@/models/Speaker";
import mongoose from "mongoose";
import slugify from "slugify";

async function handleSpeakers(speakers: any[]): Promise<mongoose.Types.ObjectId[]> {
  const result: mongoose.Types.ObjectId[] = [];
  for (const sp of speakers || []) {
    console.log(sp);
    let existing;
    if (sp.url) {
      existing = await Speaker.findOne({ url: sp.url });
    } else {
      existing = await Speaker.findOne({ name: sp.name, title: sp.title });
    }
    if (existing) {
      result.push(existing._id);
    } else {
      const doc: Partial<Speaker> = {
        name: sp.name,
        title: sp.title,
      };
      if (sp.photo_url) doc.photo_url = sp.photo_url;
      if (sp.url)       doc.url       = sp.url;
      if (sp.twitter)   doc.twitter   = sp.twitter;
      if (sp.linkedin)  doc.linkedin  = sp.linkedin;
      const newSp = new Speaker(doc);
      await newSp.save();
      result.push(newSp._id);
    }
  }
  return result;
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const {
      title,
      date_from,
      date_to,
      url,
      ticket_url,
      brief_description,
      description,
      speakers: rawSpeakers,
      agenda: rawAgenda,
      organization,
      photo_url,
      is_virtual,
      is_in_person,
      is_date_range,
      location,
    } = body;

    const baseBacklink = slugify(title, { lower: true, strict: true });
    let backlink = baseBacklink;
    let counter = 1;
    // keep adding "-1", "-2", ... until it's unique
    while (await Event.findOne({ backlink })) {
      backlink = `${baseBacklink}-${counter}`;
      counter += 1;
    }

    // 1) upsert speakers
    const speakerIds = await handleSpeakers(rawSpeakers);

    // 2) build nested agenda
   const agenda = (rawAgenda || []).map(day =>
    (day.items || []).map(item => ({
      start_time: item.start_time,
      end_time:   item.end_time,
      topic:      item.topic,
      brief_description: item.brief_description,
      speakers:   [] as mongoose.Types.ObjectId[],
    }))
  );

    // 3) create event
    const evt = new Event({
      title,
      date_from,
      date_to,
      url,
      backlink,
      ticket_url,
      brief_description,
      description,
      speakers: speakerIds,
      agenda,
      organization,
      photo_url,
      is_virtual,
      is_in_person,
      is_date_range,
      location,
      is_approved: false,
    });

    await evt.save();
    return NextResponse.json({ success: true, event: evt }, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: e.message || "Server error" },
      { status: 500 }
    );
  }
}
