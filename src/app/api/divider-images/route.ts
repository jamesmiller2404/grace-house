import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const IMAGE_EXTS = new Set([".png", ".svg", ".webp", ".jpg", ".jpeg", ".gif"]);

function formatLabel(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  return base
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
    .trim();
}

export async function GET() {
  try {
    const dir = path.resolve(process.cwd(), "public", "images", "dividers");
    const entries = await readdir(dir, { withFileTypes: true });
    const images = entries
      .filter((e) => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()))
      .map((e) => ({
        path: `/images/dividers/${e.name}`,
        name: formatLabel(e.name),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
