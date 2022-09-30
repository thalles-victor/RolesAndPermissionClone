import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { validate } from 'class-validator';

import { User } from '../entity/User';
import config from '../config/config';

export class AuthController {

  private userRepository = AppDataSource.getRepository(User);

  async login(request: Request, response: Response) {
    let { username, password } = request.body;

    if(!(username && password)) {
      response.status(400).send();
    }

    let user: User;
    try {
      user = await this.userRepository.findOneOrFail({
        where: { username },
      });
    } catch(error) {
      response.status(401).send();
    }

    //Chack if encypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      response.status(401).send();
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },

      config.jwtSecret,

      { expiresIn: "1h" }
    )
  }

  async changePassword(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const { oldPassword, newPassword } = request.body;

    if (!(oldPassword && newPassword)) {
      response.status(400).send()
    }

    let user: User;
    try {
      user = await this.userRepository.findOneOrFail({
        where: { id },
      });
    } catch(error) {
      response.status(401).send()
      return;
    }

    //Validate de model (password, lenght)
    user.password = newPassword;
    const errors = await validate(user);

    if (errors.length > 0) {
      response.status(400).send(errors);
    }

    //Hash the new password and save
    user.hashPassword();
    await this.userRepository.save(user);

    response.status(204).send();
  }
}
