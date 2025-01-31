import {Request, Response, NextFunction } from 'express';
import logger from "../utils/logger";


function loggingMiddleware (req: Request, res: Response, next: NextFunction) {
    logger.log("info", `Incoming request [Url: ${req.url}] [Method: ${req.method}] [${req.ip}]`)
    next()
}

export default loggingMiddleware;