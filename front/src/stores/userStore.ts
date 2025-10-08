import {type AxiosError} from "axios";
import {create} from "zustand";
import {jwtDecode} from "jwt-decode";
import type {User} from "../models/user";
import {axiosInstance} from "../utils/utils.ts";



interface UserJWT {
    email: string;
    exp: number;
    iat: number;
}

interface UserStore {
    userToken: undefined | string;
    userInfo: User | null;
    isAuthenticated: boolean;
    fetchAuthToken: (email: string, password: string) => Promise<string | Error>;
    logout: () => void;
    registerUser: (email: string, password: string) => Promise<string | Error>;
    decodeToken: (token: string) => Promise<string | null | Error>
    fetchUserInfo: () => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
    userToken: undefined,
    userInfo: null,
    isAuthenticated: false,
    fetchAuthToken: async (email: string, password: string) => {
        try {
            const res = await axiosInstance.post("auth/login", {email, password})
            set({userToken: res.data.data.token, isAuthenticated: true});
            localStorage.setItem("token", res.data.data.token);
            return res.data.data.token
        } catch (err) {
            const axiosError = err as AxiosError;
            console.error("Erreur lors de l'authentification : ", err)
            if (axiosError.status === 401) {
                throw new Error("Votre mot de passe ou votre adresse mail est invalide.");
            }
            throw new Error("Une erreur interne est survenue.");
        }
    },
    logout: () => {
        localStorage.removeItem("token");
        set({userToken: undefined, isAuthenticated: false, userInfo: null});
    },
    registerUser: async (email: string, password: string) => {
        try {
            const res = await axiosInstance.post("auth/register", {email, password})
            return res.data.data.email
        } catch (err) {
            const axiosError = err as AxiosError;
            console.error("Erreur lors de l'authentification : ", err)
            if (axiosError.status === 409) {
                throw new Error("Cette adresse mail est déjà utilisée.");
            }
            throw new Error("Une erreur interne est survenue.");
        }
    },
    decodeToken: async (token: string) => {
        if (token.trim() === "") return null
        try {
            const decoded = jwtDecode<UserJWT>(token)
            set({isAuthenticated: true})
            return decoded.email
        } catch (err) {
            console.error("Erreur lors du decode token : ", err)
            set({userToken: undefined, isAuthenticated: false, userInfo: null})
            throw new Error("Erreur lors du decode token.");
        }
    },
    fetchUserInfo: async () => {
        try {
            const res = await axiosInstance.get("/auth/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            set({userInfo: res.data.data.user})
        } catch (err) {
            console.error(err)
            set({userToken: undefined, isAuthenticated: false, userInfo: null})
            throw new Error("Erreur lors de la récupération des infos de l'utilisateur.");
        }
    }
}))

export default useUserStore;