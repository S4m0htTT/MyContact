import {Request} from "express";
import {decodeToken} from "../utils/JWTUtils.js";
import Contact, {IContact} from "../model/Contact.js";
import User from "../model/User.js";
import mongoose from "mongoose";

class ContactServices {
    constructor() {
        this.getUserContact = this.getUserContact.bind(this);
        this.getContactById = this.getContactById.bind(this);
        this.createContact = this.createContact.bind(this);
        this.updateContact = this.updateContact.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
    }

    async getUserContact(req: Request) {
        try {
            let token = req.get("Authorization")

            if (!token) throw new Error("Token not provided");

            token = token.split(" ")[1]
            const decoded = decodeToken(token);
            if (!decoded?.email) throw new Error("Invalid token");

            const userDb = await User.findOne({email: decoded.email})
            if (!userDb) throw new Error(`User with email ${decoded.email} not found.`);

            const contactDb = await Contact.find({user: userDb._id})

            return {
                success: true,
                statusCode: 200,
                errors: null,
                data: {
                    contact: contactDb,
                },
            };
        } catch (err) {
            console.log(err);
            return {
                success: false,
                statusCode: 500,
                errors: err,
                data: {
                    message: "Internal Server Error"
                },
            };
        }
    }

    async getContactById(req: Request) {
        try {
            let token = req.get("Authorization")

            if (!token) throw new Error("Token not provided");

            token = token.split(" ")[1]
            const decoded = decodeToken(token);
            if (!decoded?.email) throw new Error("Invalid token");

            const userDb = await User.findOne({email: decoded.email})
            if (!userDb) throw new Error(`User with email ${decoded.email} not found.`);

            const contactId = req.params.id;

            const querySearch = {
                $and: [
                    {user: userDb._id},
                    {_id: new mongoose.Types.ObjectId(contactId)}
                ]
            }

            const contactDb = await Contact.findOne(querySearch)

            if (!contactDb) {
                return {
                    success: false,
                    statusCode: 404,
                    errors: "Could not find contact",
                    data: {
                        message: `Could not find contact with id ${req.params.id}`,
                    }
                }
            }

            return {
                success: false,
                statusCode: 200,
                errors: null,
                data: {
                    contact: contactDb,
                }
            }

        } catch (err) {
            console.log(err);
            return {
                success: false,
                statusCode: 500,
                errors: err,
                data: {
                    message: "Internal Server Error"
                },
            };
        }
    }

    async createContact(req: Request) {
        try {
            let token = req.get("Authorization")
            const body = req.body;

            if (!token) throw new Error("Token not provided");

            token = token.split(" ")[1]
            const decoded = decodeToken(token);
            if (!decoded?.email) throw new Error("Invalid token");

            const userDb = await User.findOne({email: decoded.email})
            if (!userDb) throw new Error(`User with email ${decoded.email} not found.`);

            const newContact: IContact = await Contact.create({
                ...body,
                user: userDb._id
            })

            return {
                success: true,
                statusCode: 201,
                errors: null,
                data: {
                    contact: newContact,
                }
            }

        } catch (err) {
            console.log(err);
            return {
                success: false,
                statusCode: 500,
                errors: err,
                data: {
                    message: "Internal Server Error"
                },
            };
        }
    }

    async updateContact(req: Request) {
        try {
            const body = req.body;

            const contactDb = await Contact.findOne({_id: req.params.id})

            if (!contactDb) {
                return {
                    success: false,
                    statusCode: 404,
                    errors: "Could not find contact",
                    data: {
                        message: `Could not find contact with id ${req.params.id}`,
                    }
                }
            }

            let token = req.get("Authorization")

            if (!token) throw new Error("Token not provided");

            token = token.split(" ")[1]
            const decoded = decodeToken(token);
            if (!decoded?.email) throw new Error("Invalid token");

            const userDb = await User.findOne({email: decoded.email})
            if (!userDb) throw new Error(`User with email ${decoded.email} not found.`);

            if (!userDb._id.equals(contactDb.user)) {
                return {
                    success: false,
                    statusCode: 403,
                    errors: "Access denied: this contact does not belong to the authenticated user.",
                    data: {
                        message: "You are not authorized to perform this action on this contact.",
                    },
                };
            }

            const updates: Partial<IContact> = {};

            if (body.phoneNumber && body.phoneNumber !== contactDb.phoneNumber) {
                updates.phoneNumber = body.phoneNumber;
            }

            if (body.firstName && body.firstName !== contactDb.firstName) {
                updates.firstName = body.firstName;
            }

            if (body.lastName && body.lastName !== contactDb.lastName) {
                updates.lastName = body.lastName;
            }

            if (Object.keys(updates).length === 0) {
                return {
                    success: true,
                    statusCode: 304,
                    data: {
                        message: "No changes detected.",
                        updatedFields: {}
                    },
                };
            }

            await Contact.updateOne({_id: req.params.id}, {$set: updates});

            return {
                success: true,
                statusCode: 200,
                data: {
                    message: "Contact updated successfully.",
                    updatedFields: updates,
                },
            };

        } catch (err) {
            console.log(err);
            return {
                success: false,
                statusCode: 500,
                errors: err,
                data: {
                    message: "Internal Server Error"
                },
            };
        }
    }

    async deleteContact(id: string, token: string) {
        try {
            const contactDb = await Contact.findOne({_id: id})
            if (!contactDb) {
                return {
                    success: false,
                    statusCode: 404,
                    errors: "Could not find contact",
                    data: {
                        message: `Could not find contact with id ${id}`,
                    }
                }
            }

            if (!token) throw new Error("Token not provided");

            token = token.split(" ")[1]
            const decoded = decodeToken(token);
            if (!decoded?.email) throw new Error("Invalid token");

            const userDb = await User.findOne({email: decoded.email})
            if (!userDb) throw new Error(`User with email ${decoded.email} not found.`);

            if (!userDb._id.equals(contactDb.user)) {
                return {
                    success: false,
                    statusCode: 403,
                    errors: "Access denied: this contact does not belong to the authenticated user.",
                    data: {
                        message: "You are not authorized to perform this action on this contact.",
                    },
                };
            }

            await Contact.deleteOne({_id: id})

            return {
                success: true,
                statusCode: 200,
                errors: null,
                data: {
                    message: "Contact deleted successfully.",
                }
            }
        } catch (err) {
            console.log(err);
            return {
                success: false,
                statusCode: 500,
                errors: err,
                data: {
                    message: "Internal Server Error"
                },
            };
        }
    }
}

export default ContactServices;