import { Request, Response } from 'express';

export type ApolloContext = {
  req: Request & { user: {id: string, email: string}}
  res: Response
  user: {
    id: string
    email: string
  } | null | undefined
}