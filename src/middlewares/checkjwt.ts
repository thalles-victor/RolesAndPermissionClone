import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export function checkJwt(request: Request, response: Response, next:NextFunction) {
  const token = <string>request.headers["auth"];
  let jwtPayload;

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    response.locals.jwtPayload = jwtPayload;
  } catch(error) {
    response.status(401).send();
    return;
  }

  //The token is valid for 1 hour
  //We want send a new token on every request
  const { userid, username } = jwtPayload;
  const newToken = jwt.sign({ userid, username }, config.jwtSecret, {
    expiresIn: "1h"
  })

  response.setHeader("token", newToken);

  //Call the next middleware or controller
  next()
}