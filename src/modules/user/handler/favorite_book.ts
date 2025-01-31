import {IFavoriteBookService} from "../interfaces/service";
import {injectable, inject} from "tsyringe";
import BaseResponse from "../../../utils/base_response";
import {Request, Response} from "express";
import {FavoriteBookDTO} from "../dto/favorite_books";
import {validate} from "class-validator";
import {clasValidate} from "../../../utils/validator";
import logger from "../../../utils/logger";
import {DbError, NotFoundError, ValidationError} from "../../../error/error";


@injectable()
export class FavoriteBookHandler {
    private readonly service:IFavoriteBookService;

    constructor(@inject("IFavoriteBookService") service:IFavoriteBookService) {
        this.service = service;
    }

    async favoriteBook (req:Request, response:Response): Promise<Response> {
        try {
            // retrieve user_id from header
            const userID = req.user?.id

            if (!userID) {
                return response.status(400).json(BaseResponse.ErrorResponse("Bad Request", ["An error occured"]));
            }

            const {bookID} = req.body

            const request:FavoriteBookDTO = new FavoriteBookDTO(userID, bookID)

            const err = await validate(request)

            if (err.length > 0) {
                const errMsg = clasValidate(err)

                return response.status(400).json(BaseResponse.ErrorResponse("Bad Request", errMsg))
            }

          const result = await this.service.FavoriteBook(request)

            if (!result) {
                return response.status(500).json(BaseResponse.ErrorResponse("Internal Server Error", ["An error occurred"]));
            }

            return response.status(200).json(BaseResponse.SuccessResponse("success", result))
        }catch (e) {
            logger.log("error", `Failed on favorite book handler with caught exception ${e}`)

            if (e instanceof NotFoundError) {
                return response.status(e.statusCode).json(BaseResponse.ErrorResponse("Not found", [e.msg]))
            }

            if (e instanceof ValidationError) {
                return response.status(e.statusCode).json(BaseResponse.ErrorResponse("Bad Request", [e.msg]))
            }

            if (e instanceof  DbError) {
                return response.status(e.statusCode).json(BaseResponse.ErrorResponse("Internal Server Error", [e.msg]))
            }

            return response.status(500).json(BaseResponse.ErrorResponse("An error occured", [`${e}`]))
        }
    }
}