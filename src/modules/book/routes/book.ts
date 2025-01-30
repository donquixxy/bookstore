import {Router} from "express";
import {container} from "tsyringe";
import {BookHandler} from "../handler/book";
import {validateToken} from "../../../middleware/jwt";

export function initBookRoutes (router:Router):Router {
    const bookHandler = container.resolve<BookHandler>("BookHandler");
    // Apply the validateToken middleware to the "/books" route
    router.use(validateToken);  // This will ensure token validation before any route handling
    router.get("/books", (req,res) => {
        bookHandler.getAll(req,res)
    })

    return router
}