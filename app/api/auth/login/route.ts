import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock user database
const users = [
  {
    id: "1",
    name: "Jack Watson",
    email: "admin@demo.com",
    password: "password", // In production, this would be hashed
    role: "CTO Assistant",
  },
  {
    id: "2",
    name: "Demo User",
    email: "user@demo.com",
    password: "password",
    role: "Financial Analyst",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session token (in production, use proper JWT)
    const sessionToken = Buffer.from(JSON.stringify({ userId: user.id })).toString("base64")

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
