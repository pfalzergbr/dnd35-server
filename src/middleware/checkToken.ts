import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import keys from '../config/keys'
import { UserContext } from '../typings/context'

type RequestWithUser = Request & { user: {
  id: string,
  email: string
}}

export const checkToken = () => {
  (req: RequestWithUser, _:Response, next: NextFunction) => {
    if (req.cookies.jwt) {
      const user = jwt.verify(req.cookies.jwt, keys.JWT_SECRET);
      req.user = user as UserContext;
    }
    return next();
  }
}