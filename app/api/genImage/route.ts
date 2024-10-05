import { generateImage } from '@/app/actions'
import { LRUCache } from 'lru-cache'
import { NextRequest, NextResponse } from 'next/server'

const rateLimiter = new LRUCache<string, number>({
  max: 500,
  ttl: 1000 * 60
})

export async function POST(req: NextRequest) {
  try {
    const ipAddress =
      req.headers.get('x-real-ip') ||
      req.headers.get('x-forwarded-for') ||
      '127.0.0.1'

    const currentRequestCount = rateLimiter.get(ipAddress) || 0

    if (currentRequestCount >= 10) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429 }
      )
    }

    rateLimiter.set(ipAddress, currentRequestCount + 1)

    const { text } = await req.json()

    const imageUrl = await generateImage(text)

    return NextResponse.json({ imageUrl: imageUrl }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
