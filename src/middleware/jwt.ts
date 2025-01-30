import { NextFunction, Request, Response } from "express";
import BaseResponse from "../utils/base_response";
import { container } from "tsyringe";
import { IUserService } from "../modules/user/interfaces/service";
import { UserFilterDTO } from "../modules/user/dto/user";
import { JwtClaims } from "../modules/user/model/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../utils/logger";

export async function validateToken(req: Request, res: Response, next: NextFunction):Promise<void> {
   logger.log("info", "On validating token")
    // Check if Authorization header exists
    if (!req.headers.authorization) {
         res.status(401).send(BaseResponse.ErrorResponse("Unauthorized", ["Authorization is required"]));
        return
    }

    const authParts = req.headers.authorization.split(" ");
    if (authParts.length !== 2 || authParts[0] !== "Bearer") {
         res.status(401).send(BaseResponse.ErrorResponse("Unauthorized", ["Bearer Token is required"]));
        return
    }
    const userToken = authParts[1];

    // Parse token
    const parseToken = (token: string): JwtClaims | null => {
        try {
            const decodedJwt = jwt.verify(token, "jwt202345") as JwtPayload;
            return { id: decodedJwt.id };
        } catch (error) {
            logger.log("error", `Invalid JWT caught exception: ${error}`);
            return null;
        }
    };

    const resultToken = parseToken(userToken);

    if (!resultToken) {
         res.status(401).send(BaseResponse.ErrorResponse("Unauthorized", ["Invalid or expired token"]));
        return
    }

    const uService = container.resolve<IUserService>("IUserService");

    const filterDTO: UserFilterDTO = {
        token: userToken,
        id: resultToken.id,
    };

    try {
        const validUser = await uService.Get(filterDTO);

        if (!validUser) {
             res.status(401).send(BaseResponse.ErrorResponse("Unauthorized", ["Unauthorized Token"]));
            return
        }

        // Move to the next middleware
        next();
    } catch (error) {
        logger.log("error", `Error while validating user: ${error}`);
         res.status(500).send(BaseResponse.ErrorResponse("Internal Server Error", ["Error validating token"]));
         return
    }
}
