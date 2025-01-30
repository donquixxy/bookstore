import {IBookService} from "../interfaces/service";
import {inject, injectable} from "tsyringe";
import {Request, Response} from "express";
import {BookFilterDTO} from "../dto/book";
import {Pagination} from "../../../utils/pagination";
import logger from "../../../utils/logger";
import BaseResponse, {PaginatedResponse} from "../../../utils/base_response";

@injectable()
export class BookHandler {
    private bookService:IBookService

    constructor(@inject("IBookService") bookService:IBookService) {
        this.bookService = bookService;
    }

    async getAll (request:Request, response:Response):Promise<Response> {
        try {
            const filter: BookFilterDTO = {
                id: request.query.id as string,
                title: request.query.title as string,
                authorName: request.query.authorName as string,
                pagination: new Pagination(
                    request.query.limit ? parseInt(request.query.limit as string, 10) : undefined,
                    request.query.page ? parseInt(request.query.page as string, 10) : undefined,
                    request.query.all ? request.query.all === "true" : undefined
                ),
            };

           const {books, count} = await this.bookService.GetAll(filter)

            return response.status(200).json(PaginatedResponse.SuccessPaginated("Successfully retrieved", books!, count, filter.pagination?.page ?? 1, filter.pagination?.limit ?? 10))
        }catch (err) {
            logger.log("error", `Failed on handler GetAll with caught exception ${err}`)
            return response.status(500).json(BaseResponse.ErrorResponse("An error occured", ["Failed to retrieve data"]))
        }
    }
}