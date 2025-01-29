import "reflect-metadata"; // Required for tsyringe to work
import { container } from "tsyringe";
import {IUserRepository} from "./modules/user/interfaces/repository";
import UserRepository from "./modules/user/repository/user";
import UserCreateDTO from "./modules/user/dto/user";
import logger from "./utils/logger";
import DbProvider from "./database/sequelize";
import dotenv from "dotenv";
import DatabaseConfig from "./config/database";
import initializeModels from "./modules/user/entity/index"
import express, {Router} from "express"
import cors from "cors";
import loggingMiddleware from "./middleware/logging";
import {IUserService} from "./modules/user/interfaces/service";
import UserService from "./modules/user/service/user";
import {initUserRoute} from "./modules/user/routes/user";
import UserHandler from "./modules/user/handler/user";




 function bootstrapApp () {
    logger.log("info", "Bootstrapping app . . . .")
    const app = express()

    app.use(cors())
        app.use(express.json())
    const router = Router();

    container.register<IUserRepository>("IUserRepository", {
        useFactory: () => new UserRepository(container.resolve<DbProvider>("DbProvider")),
    });
    container.register<DbProvider>("DbProvider", {
        useClass:DbProvider,
    });
     container.register<IUserService>("IUserService", {
         useClass: UserService,
     });
     container.register<UserHandler>("UserHandler", {
         useFactory: () => new UserHandler(container.resolve<IUserService>("IUserService")),
     });

     initializeModels();


   const server =  app.listen(8082, () => {
         logger.log("info", "Starting application at port 8082");
     }).on("error", (error) => {
         logger.log("error", `Failed to start application: ${error.message}`);
         console.error(`Error: ${error.message}`);
     });

   process.on("SIGINT", (sig) => {
       logger.log("info", `Shutting down sever ${sig} . . .`)
       server.close(()=> {
           process.exit(0)
       })
   })

    const r =  initUserRoute(app, router)

     app.use("/api", r)


}
bootstrapApp()