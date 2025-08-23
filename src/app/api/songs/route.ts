import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log("[510-usb] Server started and API route loaded");

function log(...args: unknown[]) {
  console.log("[510-usb]", ...args);
}

export async function GET() {
  log("GET /api/songs");
  const songs = await prisma.song.findMany({ orderBy: { timestamp: "desc" } });
  log("Fetched songs:", songs);
  return NextResponse.json(songs);
}

export async function POST(req: Request) {
  log("POST /api/songs called");
  const contentType = req.headers.get("content-type") || "";
  let originalLink = "";
  let title = null;
  let youtubeLink = null;

  if (contentType.includes("application/x-www-form-urlencoded")) {
    // Twilio webhook
    const body = await req.text();
    log("Received Twilio webhook body:", body);
    const params = new URLSearchParams(body);
    const smsBody = params.get("Body") || "";
    if (!smsBody) {
      log("Error: No SMS body found");
      return NextResponse.json({ error: "No SMS body found" }, { status: 400 });
    }
    originalLink = smsBody;
    log("Song received from Twilio:", originalLink);
  } else {
    // Standard JSON
    const data = await req.json();
    log("Received JSON body:", data);
    originalLink = data.originalLink;
    title = data.title;
    youtubeLink = data.youtubeLink;
  }

  if (!originalLink) {
    log("Error: Missing song link");
    return NextResponse.json({ error: "Missing song link" }, { status: 400 });
  }

  try {
    const song = await prisma.song.create({
      data: {
        originalLink,
        title,
        youtubeLink,
      },
    });
    log("Saved song to Supabase:", song);
    return NextResponse.json(song);
  } catch (error) {
    log("Error saving song:", error);
    return NextResponse.json({ error: "Failed to save song" }, { status: 500 });
  }
}
