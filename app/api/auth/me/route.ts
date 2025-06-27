import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Decode session (in production, verify JWT)
    const sessionData = JSON.parse(Buffer.from(session.value, "base64").toString())

    // Mock user data (in production, fetch from database)
    const user = {
      id: sessionData.userId,
      name: "Jack Watson",
      email: "admin@demo.com",
      role: "CTO Assistant",
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
