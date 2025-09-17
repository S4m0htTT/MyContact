const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const EMAIL_REGEX = /^[\w-.]+@[\w-]+(\.[\w-]+)+$/;

export function isValidPassword(password: string): boolean {
    return PASSWORD_REGEX.test(password);
}

export function isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
}