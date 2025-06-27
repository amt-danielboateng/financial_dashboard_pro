import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // In production, I would:
    // 1. Validate input
    // 2. Check if user exists
    // 3. Hash password
    // 4. Save to database

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: "User",
    }

    // Create session token
    const sessionToken = Buffer.from(JSON.stringify({ userId: newUser.id })).toString("base64")

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ user: newUser })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
