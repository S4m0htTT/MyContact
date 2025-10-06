import ContactServices from "../services/ContactServices.js";
import {Request, Response, Express} from "express";

const formServices = new ContactServices()

class ContactController {
    private service: ContactServices;

    constructor(service: ContactServices) {
        this.service = service;
        this.getUserContact = this.getUserContact.bind(this);
        this.createContact = this.createContact.bind(this);
        this.updateContact = this.updateContact.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
    }

    async getUserContact(req: Request, res: Response) {
        const r = await this.service.getUserContact(req)
        return res.status(r.statusCode).send(r);
    }

    async createContact(req: Request, res: Response) {
        const r = await this.service.createContact(req)
        return res.status(r.statusCode).send(r);
    }

    async updateContact(req: Request, res: Response) {
        const r = await this.service.updateContact(req)
        return res.status(r.statusCode).send(r);
    }

    async deleteContact(req: Request, res: Response) {
        const r = await this.service.deleteContact(req.params.id, req.get("Authorization") ?? "")
        return res.status(r.statusCode).send(r);
    }

}

export default new ContactController(formServices)