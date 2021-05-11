import { Request, Response } from 'express';


export interface UserContext {
  id: string, 
  email: string
}

export type RequestWithUser = Request & { user: {
  id: string,
  email: string
}}

export type ApolloContext = {
  req: Request & { user: UserContext}
  res: Response
  user: UserContext | null | undefined
}