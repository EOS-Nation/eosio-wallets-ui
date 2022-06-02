import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

type Data = {
  name: string,
  data: number | null,
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {
  const previous = await redis.get<number>('count') || 0;
  const current = previous + 1;
  await redis.set<number>('count', current );
  res.status(200).json({ name: 'John Doe', data: current })
}
