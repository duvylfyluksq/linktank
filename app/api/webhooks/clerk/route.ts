import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser } from '@/app/actions/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  const eventType = evt.type

  if(eventType === "user.created"){
    const { id, email_addresses, first_name, last_name, username, created_at, updated_at, last_sign_in_at} = evt.data;

    const user = {
        clerk_id: id,
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email_addresses[0].email_address,
        saved_events: [],
        created_at: created_at,
        updated_at: updated_at,
        last_sign_in_at: last_sign_in_at
    };

    return createUser(user);
  }

  if(eventType === "user.deleted"){
    const {id} = evt.data;

    const user = {
        clerk_id: id
    }

    return deleteUser(user);
  }

  return NextResponse.json({ success: true, message: "Event type not handled" }, { status: 200 });
}