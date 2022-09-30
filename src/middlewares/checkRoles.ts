import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';

import { User } from '../entity/User';

function checkRole(roles: Array<string>) {
  return async(request: Request, response: Response, next: NextFunction) => {
    const id = response.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = AppDataSource.getRepository(User);

    let user: User;
    try {
      user = await this.userRepository.findOneOrFail(id);

    } catch(error) {
      response.status(401).send()
    }

    if (roles.indexOf(user.role) > -1) next();
    else response.status(401).send();
  }
}