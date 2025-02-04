import {IUserService} from "../interfaces/service";
import {injectable, inject} from "tsyringe";
import User, {LoginDTO, UserFilterDTO} from "../dto/user";
import { Request, Response } from "express";
import {plainToClass, plainToInstance} from "class-transformer";
import UserCreateDTO from "../dto/user";
import {validate} from "class-validator";
import BaseResponse from "../../../utils/base_response";
import logger from "../../../utils/logger";
import {clasValidate} from "../../../utils/validator";
import base_response from "../../../utils/base_response";
import {DbError, NotFoundError, ValidationError} from "../../../error/error";

@injectable()
class UserHandler {
    private readonly userService:IUserService

    constructor(@inject("IUserService")userService:IUserService) {
        this.userService = userService;
    }

    async createUser (request:Request,response:Response):Promise<Response> {
        try {
            // Create an instance of UserCreateDTO

            const userDto =   plainToInstance(UserCreateDTO, request.body) as UserCreateDTO
            console.log(userDto)
            const err = await validate(userDto);

            if (err.length > 0) {
                const errMsgs = clasValidate(err)

                return response.status(400).json(BaseResponse.ErrorResponse("Bad Request", errMsgs))
            }
            const result = await this.userService.CreateUser(userDto)

            if (result === null) {
                return response.status(500).json(BaseResponse.ErrorResponse("An error occured. Try again later", ["An error occured"]))
            }

            return response.status(200).json(BaseResponse.SuccessResponse("Successfully created", result))
        }catch (e) {
            logger.log("error", `error creating user ${e}`);
            return response.status(500).json(BaseResponse.ErrorResponse("An error occured. Try again later", [`${e}`]))
        }
    }

    async getAll (request:Request, response:Response):Promise<Response> {
        try {
            const {name,id,email} = request.query

            const filter = new UserFilterDTO();
            filter.WithPreload = true

            if (name && name !== "") {
                filter.name = name as string;
            }

            if (id && id !== "") {
                filter.id = id as string;
            }

            if (email && email !== "") {
                filter.email = email as string;
            }

            const result = await this.userService.GetAll(filter)

            return response.status(200).json(BaseResponse.SuccessResponse("successfully retrieved", result))
        } catch (e) {
            logger.log("error", `error getting user ${e}`);
            return response.status(500).json(BaseResponse.ErrorResponse("An error occured", [`${e}`]))
        }
    }

    async login (request:Request, response:Response): Promise<Response> {
        try {
            const loginRequest = new LoginDTO();

            Object.assign(loginRequest, request.body);

            const err = await validate(loginRequest);

            if (err.length > 0 ) {
                const errMsg = clasValidate(err)

                return response.status(400).json(BaseResponse.ErrorResponse("Bad Request", errMsg))
            }

            const result = await this.userService.Login(loginRequest)

            if (!result) {
                return response.status(500).json(BaseResponse.ErrorResponse("An error occured. Try again later", ["An error occured"]))
            }

            return response.status(200).json(BaseResponse.SuccessResponse("Successfully logged in", result))
        }catch (e) {
            logger.log("error", `error login user ${e}`);

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

export default UserHandler;