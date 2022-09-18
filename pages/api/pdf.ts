// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readFile } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

type Data = {
  name: string
  data: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  readFile(path.join(process.cwd(), '/file/embed.pdf'), null, (err, data)=>{
    res.status(200).json({
      name: 'embed.pdf',
      data: data.toString('base64')
    })
  })
}
