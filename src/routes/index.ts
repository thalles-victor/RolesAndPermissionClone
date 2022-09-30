import { Request, Response, Router } from "express"
import { AuthController } from '../controllers/AuthController';
import { checkJwt } from '../middlewares/checkjwt';

const routes = Router();

const authController = new AuthController()

routes.post("/login", authController.login);

routes.post("/change-password", [checkJwt], authController.changePassword);

import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

routes.get("/all", async (request: Request, response: Response) => {
  const userRepository = await AppDataSource.getRepository(User);
  const allUsers = await userRepository.find();

  return response.status(200).json(allUsers)
})

export { routes }