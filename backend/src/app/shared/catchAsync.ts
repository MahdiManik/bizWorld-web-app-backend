import { NextFunction, Request, RequestHandler, Response } from "express";

// Define a more flexible handler type that accepts functions returning any value
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// Updated catchAsync to work with both standard and custom handlers
const catchAsync = (fn: AsyncRequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default catchAsync;
