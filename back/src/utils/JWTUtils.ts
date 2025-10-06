import jwt from "jsonwebtoken";
import cst from "../server/constants.js"

export function generateToken(email: string) {
    return jwt.sign(
        {email: email},
        cst.ADMIN.JWT_SECRET || "",
        {expiresIn: '24h', algorithm: 'HS256'})
}

export function decodeToken(token: string) {
    return jwt.verify(token, cst.ADMIN.JWT_SECRET as string, {
        algorithms: ['HS256'],
    }) as { email: string }
}
