import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const songs = await prisma.song.findMany();
  const youtubeLinks = songs
    .map((song) => song.youtubeLink)
    .filter((link) => !!link);
  return new NextResponse(JSON.stringify(youtubeLinks, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=songs-youtube.json",
    },
  });
}
