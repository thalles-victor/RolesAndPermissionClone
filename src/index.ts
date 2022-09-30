import 'reflect-metadata';
// import { createConnection } from 'typeorm';
import * as express from 'express'
import * as bodyParser from "body-parser"
import * as helmet from 'helmet'
import * as cors from 'cors';
import { routes } from './routes'

import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {
    //Create a new express application instance
    const app = express()
    
    // Call midlewares
    app.use(cors());
    // app.use(helmet());
    app.use(bodyParser.json())

    app.use("/", routes);

    const PORT = 3000;
    app.listen(3000, () => {
        console.log(`Server is running at http://localhost:${3000}`)
    })

    // insert new users for test
    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Timber",
    //         lastName: "Saw",
    //         age: 27
    //     })
    // )

    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Phantom",
    //         lastName: "Assassin",
    //         age: 24
    //     })
    // )
    
}).catch(error => console.log(error))
