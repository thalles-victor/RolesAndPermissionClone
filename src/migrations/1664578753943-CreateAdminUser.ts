import { MigrationInterface, QueryRunner } from "typeorm"

import { User } from "../entity/User";
import { AppDataSource } from "../data-source"; 

export class CreateAdminUser1664578753943 implements MigrationInterface {

    private userRepository = AppDataSource.getRepository(User);

    public async up(queryRunner: QueryRunner): Promise<void> {
        const user =  Object.assign(new User(), {
            username: "admin",
            password: "admin",
            role: "admin"
        } as User);
        user.hashPassword()

        await this.userRepository.save(user);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
