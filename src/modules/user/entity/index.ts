import {container} from "tsyringe";
import DbProvider from "../../../database/sequelize";
import User from "./user";
import logger from "../../../utils/logger";

export default function initializeModels() {
    const dbProvider = container.resolve(DbProvider)
    // Initialize all entities
    User.initialize(dbProvider);

    logger.log("info", "Successfully initialize user model")
}