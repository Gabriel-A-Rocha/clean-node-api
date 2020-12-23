import { Request, Response } from "express";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";

// this adapter decouples Express from the API, allowing future changes in the web framework

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);

    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
