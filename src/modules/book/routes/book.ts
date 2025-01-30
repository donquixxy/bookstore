import {Router} from "express";
import {container} from "tsyringe";
import {BookHandler} from "../handler/book";
import {validateToken} from "../../../middleware/jwt";

export function initBookRoutes (router:Router) {
    const bookHandler = container.resolve<BookHandler>("BookHandler");
    router.get("/books", (req,res) => {
        bookHandler.getAll(req,res)
    })

    return router
}