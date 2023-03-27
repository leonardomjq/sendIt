import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    if (!session)
      return res.status(401).json({ message: 'Please sign in to make a post' })

    const title: string = req.body.title

    // validate here, make a request in components/addPost.tsx

    // get user
    const prismaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email },
    })

    // check title
    if (title.length > 300) {
      return res
        .status(403)
        .json({ message: 'please write a shorter post post' })
    }
    if (!title.length) {
      return res.status(403).json({ message: 'please do not leave empty' })
    }

    // create post
    try {
      const result = await prisma.post.create({
        data: { title, userId: prismaUser.id },
      })
      res.status(200).json(result)
    } catch (err) {
      res.status(403).json({ err: 'error has occured whilst making a post' })
    }
  }
}
