import type { NextApiRequest, NextApiResponse } from 'next'
import fetch, { Response } from 'node-fetch'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(400).json({
      message: `Invalid request method: ${req.method}.`,
    })
  }

  const { cancel_url }: any = req.body

  await fetch(cancel_url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res: Response) => res.json())
    .then((data: any) => {
      return res.status(202).json({ data: data })
    })
    .catch((error: Error) => {
      return res.status(500).json({ message: error.message })
    })
}
