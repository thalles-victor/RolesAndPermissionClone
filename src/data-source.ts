import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User";
import { CreateAdminUser1664578753943 } from './migrations/1664578753943-CreateAdminUser'

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [CreateAdminUser1664578753943],
    subscribers: [],
})
