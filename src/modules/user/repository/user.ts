    import IUserRepository from "../interfaces/repository";
    import UserCreateDTO from "../dto/user";
    import Sequelize from "../../../database/sequelize";
    import User from "../entity/user";
    import {injectable} from "tsyringe";
    import logger from "../../../utils/logger";
    import sequelize from "sequelize";


@injectable()
class UserRepository implements IUserRepository {
        private readonly dbProvider:Sequelize

        constructor(dbProvider: Sequelize) {
            this.dbProvider = dbProvider;
        }

        async CreateUser(data: UserCreateDTO, trx?:sequelize.Transaction): Promise<User | null> {
            try {
             const u = await User.create({
                 id:data.id,
                 name:data.email,
                 age:data.age,
                 email:data.email,
                 password:data.password,
             },{
                 transaction:trx ?? null
             })

             if (!u) {
                 logger.log("error", "an error occurred when create user")
                 return null;
             }

             return u
         }catch (e) {
            logger.log("error", `error creating user ${e}`);
            return null;
         }
        }
}

export default UserRepository;