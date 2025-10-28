import { getIronSession } from 'iron-session'
import { Request, Response } from 'express'
import { config } from './config.js'
import type { SessionData } from '../../types/index.js'

export async function getSession(req: Request, res: Response, cookieName: string): Promise<SessionData | null> {
  try {
    const session = await getIronSession(req, res, {
      password: config.password,
      cookieName: cookieName,
    })
    return session
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function setSession(req: Request, res: Response, cookieName: string, key: string, value: any): Promise<SessionData | null> {
  try {
    const session = await getIronSession(req, res, {
      password: config.password,
      cookieName: cookieName,
    }) as any
    session[key] = value
    await session.save()
    return session
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function deleteSession(req: Request, res: Response, cookieName: string): Promise<null> {
  try {
    const session = await getIronSession(req, res, {
      password: config.password,
      cookieName: cookieName,
    })
    await session.destroy()
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}
