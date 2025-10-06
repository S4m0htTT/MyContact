import axios from "axios";

const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const EMAIL_REGEX = /^[\w-.]+@[\w-]+(\.[\w-]+)+$/;

export function isValidPassword(password: string): boolean {
    return PASSWORD_REGEX.test(password);
}

export function isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
}

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15000
})

export const formatDate = (date: string) => {
    return new Date(date).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
};
