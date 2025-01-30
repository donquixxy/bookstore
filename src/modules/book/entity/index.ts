import {Book} from "./book";
import {container} from "tsyringe";
import DbProvider from "../../../database/sequelize";

export function initializeBookModel() {
    const dbProvider = container.resolve(DbProvider);
    Book.initialize(dbProvider)
}