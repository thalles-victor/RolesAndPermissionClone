import { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { checkJwt } from '../middlewares/checkjwt';