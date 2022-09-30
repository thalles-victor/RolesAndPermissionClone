import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from "express"
import { validate } from "class-validator";
import { User } from "../entity/User"

export class UserController {

    private userRepository = AppDataSource.getRepository(User);

    async listAll(request: Request, response: Response, next: NextFunction) {
        const users = await this.userRepository.find({
            select: ["id", "username", "role"] //We dont want to send the password on response
        });

        response.send(users);
    }

    async getOneById(request: Request, response: Response, next: NextFunction) {
        //Get the ID from the url
        const id = parseInt(request.params.id);
        
        
        try {
            const user = await this.userRepository.findOneOrFail({
                where: { id },
            })

            delete user.password; //We dont want to send the password on response,

        } catch(error) {
            response.status(404).send("User not found")
        }
         /**
          * Ele não da um retorno além do que esta no catch acima, verificar depois
          * qual o motivo de estar fazendo isso, que provavelmente ele esqueceu de fazer
          */
    }

    async newUser(request: Request, response: Response) {
        let { username, password, role } = request.body;

        let user = Object.assign(new User(), {
            username,
            password,
            role
        });

        //Check is params is valid using class validator
        const errors = await validate(user);
        if (errors.length > 0) {
            response.status(400).send(errors);
            return; // Não to entendendo, ele poderia retornar a resposta aqui
        }

        user.hashPassword();

        try {
            await this.userRepository.save(user);
        } catch(error) {
            response.status(400).send("username already in use");
            return;
        }

        response.status(201).send("User created");
    };

    async editUser(request: Request, response: Response) {
        const id = parseInt(request.params.id);
        const { username, role } = request.body;

        let user: User;
        try {
            user = await this.userRepository.findOneOrFail({
                where: { id },
            })
        } catch(error) {
            response.status(404).send("User not found");
            return;
        }

        user.username = username;
        user.role = role;
        
        const errors = await validate(user);

        if (errors.length > 0) {
            response.status(400).send(errors);
            return;
        }

        //Try to safe, if failsm, that means username already in use
        try {
            await this.userRepository.save(user);
        } catch(error) {
            response.status(400).send("username already in use");
            return;
        }

        response.status(204).send("user was changed")
    }

    async deleteUser(request: Request, response: Response) {
        const id = parseInt(request.params.id);


        let user: User;
        try {
            user = await this.userRepository.findOneOrFail({
                where: { id },
            })
        } catch(error) {
            response.status(404).send("User not exist");
            return;
        }

        await this.userRepository.delete(id);

        response.status(204).send();
    }
}