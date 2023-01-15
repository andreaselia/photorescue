import type { NextApiRequest, NextApiResponse } from 'next'
import fetch, { Response } from 'node-fetch'
import redis from '../../lib/redis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(400).json({
      message: `Invalid request method: ${req.method}.`,
    })
  }

  const { image_url, is_hr, has_scratches }: any = req.body

  await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'c75db81db6cbd809d93cc3b7e7a088a351a3349c9fa02b6d393e35e0d51ba799',
      input: {
        image: image_url,
        'HR': is_hr,
        'with_scratch': has_scratches,
      },
      webhook_completed: `${process.env.SITE_URL}/api/callback`,
    }),
  })
    .then((res: Response) => res.json())
    .then(async (data: any) => {
      await redis.set(data.id, data)

      return res.status(202).json({ data: data })
    })
    .catch((error: Error) => {
      return res.status(500).json({ message: error.message })
    })
}
