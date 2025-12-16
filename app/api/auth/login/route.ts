import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    let body: unknown

    try {
      body = await request.json()
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { usernameOrEmail, password } = body as { usernameOrEmail?: unknown; password?: unknown }

    // Validation
    if (!usernameOrEmail || !password) {
      return new Response(JSON.stringify({ error: 'Username/email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Find user by username or email
    let user
    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: String(usernameOrEmail) },
            { email: String(usernameOrEmail) }
          ]
        }
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return new Response(JSON.stringify({ error: 'Database connection error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid username/email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check password
    let passwordMatch = false
    try {
      passwordMatch = await bcrypt.compare(String(password), user.password)
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError)
      return new Response(JSON.stringify({ error: 'Password verification failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: 'Invalid username/email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
    return new Response(JSON.stringify({ user: userWithoutPassword }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: `Internal server error: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
