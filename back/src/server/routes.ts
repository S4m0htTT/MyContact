import {Request, Response, NextFunction, Router} from "express";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import CST from "../server/constants.js";
import AuthController from "../controller/AuthController.js";
import ContactController from "../controller/ContactController.js";

const router = Router();

const authJwt = async (req: any, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.get("Authorization");
        let token = "";
        if (!authHeader && !req.query.token) {
            throw new Error("Token not provided or invalid");
        }
        if (authHeader) {
            if (!authHeader.startsWith("Bearer ")) {
                throw new Error("Token not provided or invalid");
            }
            token = authHeader.split(" ")[1];
        } else {
            token = req.query.token as string
        }
        const decoded = jwt.verify(token, CST.ADMIN.JWT_SECRET as string, {
            algorithms: ['HS256'],
        }) as { email: string };

        let dbUser = await User.findOne({email: decoded.email});
        if (!dbUser) {
            res.status(403).send("Access Forbidden");
            return;
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(403).send("Access Forbidden");
    }
};

router.post("/auth/login", AuthController.login);
router.post("/auth/register", AuthController.register)

router.get("/auth/me", authJwt, AuthController.me)

router.get("/contacts", authJwt, ContactController.getUserContact)
router.post("/contact", authJwt, ContactController.createContact)
router.patch("/contact/:id", authJwt, ContactController.updateContact)
router.delete("/contact/:id", authJwt, ContactController.deleteContact)

export default router;
