import axios, {type AxiosError} from "axios";
import {create} from "zustand";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15000
})

interface UserStore {
    userToken: undefined | string;
    fetchAuthToken: (email: string, password: string) => Promise<string | Error>;
    logout: () => void;
    registerUser: (email: string, password: string) => Promise<string | Error>;
}

const useUserStore = create<UserStore>((set) => ({
    userToken: undefined,
    fetchAuthToken: async (email: string, password: string) => {
        try {
            const res = await axiosInstance.post("auth/login", {email, password})
            set({userToken: res.data.data.token});
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
        set({userToken: undefined});
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
    }
}))

export default useUserStore;