import {Router} from "express";
import {container} from "tsyringe";
import {FavoriteBookHandler} from "../handler/favorite_book";

export function initFavoriteBookRoute(r:Router) {
    const favoriteBookHandler = container.resolve<FavoriteBookHandler>("FavoriteBookHandler")

    r.post("/favorite", (req, res) => {
        favoriteBookHandler.favoriteBook(req,res)
    })

    return r
}