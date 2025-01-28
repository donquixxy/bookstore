import { Express, Request, Response, NextFunction } from 'express';
import logger from "../utils/logger";


function loggingMiddleware (req: Request, res: Response, next: NextFunction) {
    logger.log("info", `Incoming request [Url: ${req.url}[${req.path}]] [Method: ${req.method}] [${req.route}] [${req.ip}]`)
}

export default loggingMiddleware;