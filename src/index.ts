import "reflect-metadata"; // Required for tsyringe to work
import { container } from "tsyringe";
import {IUserRepository} from "./modules/user/interfaces/repository";
import UserRepository from "./modules/user/repository/user";
import logger from "./utils/logger";
import DbProvider from "./database/sequelize";
import express from "express"
import cors from "cors";
import {IUserService} from "./modules/user/interfaces/service";
import UserService from "./modules/user/service/user";
import initUserRoute from "./modules/user/routes/user";
import UserHandler from "./modules/user/handler/user";
import {IBookRepository} from "./modules/book/interfaces/repository";
import {BookRepository} from "./modules/book/repository/book";
import {IBookService} from "./modules/book/interfaces/service";
import {BookService} from "./modules/book/service/book";
import {BookHandler} from "./modules/book/handler/book";
import {initBookRoutes} from "./modules/book/routes/book";
import loggingMiddleware from "./middleware/logging";
import {validateToken} from "./middleware/jwt";
import User from "./modules/user/entity/user";
import {Book} from "./modules/book/entity/book";
import {FavoriteBooks} from "./modules/user/entity/favorite_books";




 async function bootstrapApp () {
    logger.log("info", "Bootstrapping app . . . .")
    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use(loggingMiddleware)
    const publicRouter = express.Router()
    const privateRouter = express.Router()

    container.register<IUserRepository>("IUserRepository", {
        useFactory: () => new UserRepository(container.resolve<DbProvider>("DbProvider")),
    });
    container.register<DbProvider>("DbProvider", {
        useClass:DbProvider,
    });
     const dbProvider = container.resolve(DbProvider)
     container.register<IUserService>("IUserService", {
         useClass: UserService,
     });
     container.register<UserHandler>("UserHandler", {
         useFactory: () => new UserHandler(container.resolve<IUserService>("IUserService")),
     });
     container.register<IBookRepository>("IBookRepository", {
         useFactory: () => new BookRepository(dbProvider)
     })
     container.register<IBookService>("IBookService", {
         useClass: BookService,
     })
     container.register<BookHandler>("BookHandler", {
         useClass: BookHandler,
     })

     initModels()

    await dbProvider.getSequelize().sync()

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

   app.use("/api", initUserRoute(publicRouter));
   privateRouter.use(validateToken)
   app.use("/internal", initBookRoutes(privateRouter))
}
bootstrapApp()

function initModels() {
    const dbProvider = container.resolve(DbProvider)
    User.initialize(dbProvider)
    Book.initialize(dbProvider)
    FavoriteBooks.initialize(dbProvider)
    User.initAssosiation()
    FavoriteBooks.initAssosiation()
}