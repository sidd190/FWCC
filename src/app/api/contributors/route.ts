import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const repo = searchParams.get("repo") || "vercel/next.js"
  try {
    // Fetch first 100 contributors; unauthenticated is fine for demo, but subject to rate limits.
    const res = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=100`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
      // Revalidate periodically to keep it fresh without hammering
      next: { revalidate: 600 },
    })
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch contributors" }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json({ contributors: data })
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
