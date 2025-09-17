import AuthServices from "../services/AuthServices.js";
import { Request, Response, Express } from "express";

const formServices = new AuthServices();

class AuthController {
  private service: AuthServices;

  constructor(service: AuthServices) {
    this.service = service;
    this.me = this.me.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  public async me(req: Request, res: any) {
    const r = await this.service.me(req.body.email);
    return res.status(r.statusCode).send(r);
  }

  public async login(req: Request, res: any) {
    const r = await this.service.login(req.body.email, req.body.password);
    return res.status(r.statusCode).send(r);
  }

  public async register(req: Request, res: Response) {
    const r = await this.service.register(
        req.body.email,
        req.body.password
    );
    return res.status(r.statusCode).send(r);
  }
}

export default new AuthController(formServices);
