import User, {IUser} from "../model/User.js";
import {generateToken, decodeToken} from "../utils/JWTUtils.js";

class AuthServices {
    constructor() {
        this.me = this.me.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    async me(token: string) {
        try {

            if (token.trim() === "") throw new Error("Token not provided");

            token = token.split(" ")[1]
            const decoded = decodeToken(token);

            let userDb = await User.findOne({email: decoded.email})
                .select("-_id")
            if (!userDb) {
                return {
                    success: false,
                    statusCode: 404,
                    errors: "User nor found.",
                    data: {
                        message: `User with email ${decoded.email} not found.`,
                    },
                };
            }
            let userData = userDb.toObject();

            return {
                success: true,
                statusCode: 200,
                errors: null,
                data: {
                    user: userData,
                },
            };
        } catch (err) {
            console.log(err);
            return {
                success: false,
                statusCode: 500,
                errors: err,
                data: {
                    message: "Internal Server Error",
                },
            };
        }
    }

    async login(email: string, password: string) {
        try {
            if (!email || !password) {
                return {
                    success: false,
                    statusCode: 400,
                    errors: "Email and password required.",
                    data: {
                        message: "Missing data. Fields Required: email, password.",
                    },
                }
            }
            const user = await User.findOne({email: email});
            if (!user) {
                return {
                    success: false,
                    statusCode: 401,
                    errors: "Invalid email or password.",
                    data: {
                        message: "Invalid email or password.",
                    },
                }
            }

            let passwordCompare = await user.comparePassword(password);
            if (!passwordCompare) {
                return {
                    success: false,
                    statusCode: 401,
                    errors: "Invalid email or password.",
                    data: {
                        message: "Invalid email or password.",
                    },
                }
            }
            let token = generateToken(user.email);
            user.lastLogin = new Date();
            await user.save()

            return {
                success: true,
                statusCode: 200,
                errors: null,
                data: {
                    message: "OK",
                    token: token,
                },
            };
        } catch (err) {
            console.log(err);
            return {
                success: false,
                statusCode: 500,
                errors: err,
                token: null,
                data: {
                    message: "Internal Server Error"
                },
            };
        }
    }

    async register(email: string, password: string) {
        try {
            if (!email || !password) {
                return {
                    success: false,
                    statusCode: 400,
                    errors: "Email and password required.",
                    data: {
                        message: "Missing data. Fields Required: email, password.",
                    },
                }
            }
            const user: IUser | null = await User.findOne({email: email});
            if (user) {
                return {
                    success: false,
                    statusCode: 409,
                    errors: "User already exists.",
                    data: {
                        message: `User with email ${email} already exists.`,
                    },
                }
            }

            let newUser: IUser = await User.create({
                email: email,
                password: password,
                isConfirmed: true,
            });

            let userData = newUser.toJSON()
            delete userData._id

            return {
                success: true,
                statusCode: 201,
                errors: null,
                data: {
                    user: userData,
                },
            };
        } catch (err) {
            console.log(err);
            return {
                success: false,
                statusCode: 500,
                errors: err,
                data: {
                    message: "Error in user creation !",
                },
            };
        }
    }
}

export default AuthServices;
