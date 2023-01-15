import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../lib/redis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body }: any = req

  try {
    await redis.set(body.id, body)

    return res.status(200).send(body)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
