import express, {Router} from "express";
import {container} from "tsyringe";
import {IUserService} from "../interfaces/service";
import UserHandler from "../handler/user";
import logger from "../../../utils/logger";

export function initUserRoute (app: express.Application, router:Router) {
    const userService = container.resolve<IUserService>("IUserService")
    const userController = new UserHandler(userService)

    router.post("/user", (req, res) => {
        userController.createUser(req, res);
    });

    router.get("/user", (req, res) => {
        userController.getAll(req, res);
    })

    router.post("/login", (req, res) => {
        userController.login(req, res);
    })

    logger.log("info", "UserController initialized")

    return router
}

export default  initUserRoute;