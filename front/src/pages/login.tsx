import { useState } from "react";
import { isValidEmail, isValidPassword } from "../utils/utils.ts";
import { useNavigate } from "react-router";
import useUserStore from "../stores/userStore.ts";
import Input from "../components/input.tsx";

interface LoginInputs {
    email: string;
    password: string;
}

interface LoginErrors {
    email?: string;
    password?: string;
}

export default function Login() {
    const [login, setLogin] = useState<LoginInputs>({
        email: "",
        password: ""
    });
    const [loginError, setLoginError] = useState<LoginErrors>({});
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { fetchAuthToken } = useUserStore();
    const navigate = useNavigate();

    const handleChangeInputs = (input: "email" | "password", value: string) => {
        setLogin(prev => ({
            ...prev,
            [input]: value
        }));
    };

    const isButtonDisabled = () => {
        return login.email.trim() === "" || login.password.trim() === "";
    };

    const handleSubmit = async () => {
        setLoading(true);
        const errors: LoginErrors = {};

        if (!isValidEmail(login.email)) {
            errors.email = "Format de mail invalide.";
        }
        if (!isValidPassword(login.password)) {
            errors.password =
                "Le mot de passe doit contenir :\n• 8 caractères minimum\n• 1 majuscule\n• 1 minuscule\n• 1 chiffre\n• 1 caractère spécial";
        }

        if (Object.keys(errors).length > 0) {
            setLoginError(errors);
            setLoading(false);
            return;
        }

        try {
            await fetchAuthToken(login.email, login.password);
            setLoading(false);
            navigate("/");
        } catch (error) {
            setGlobalError((error as Error).message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-full max-w-md p-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg shadow-white/10 text-white">
                <p className="text-3xl text-center mb-5 font-semibold">Connexion</p>

                {globalError && (
                    <p className="text-center mt-5 text-red-400">{globalError}</p>
                )}

                <div className="mt-5">
                    <label htmlFor="email" className="mb-2 text-lg block">Email</label>
                    <Input
                        value={login.email}
                        onChange={handleChangeInputs}
                        type="email"
                        id="email"
                    />
                    {loginError.email && (
                        <p className="text-sm text-red-300 mt-1 whitespace-pre-line">{loginError.email}</p>
                    )}
                </div>

                <div className="mt-4">
                    <label htmlFor="password" className="mb-2 text-lg block">Mot de passe</label>
                    <Input
                        value={login.password}
                        onChange={handleChangeInputs}
                        type="password"
                        isPassword
                        id="password"
                    />
                    {loginError.password && (
                        <p className="text-sm text-red-300 mt-1 whitespace-pre-line">{loginError.password}</p>
                    )}
                </div>

                <button
                    className={`rounded-md px-4 py-2 mt-6 w-full font-semibold transition-all duration-300 ${
                        isButtonDisabled()
                            ? "cursor-not-allowed bg-white/20 text-white/50 border border-white/30"
                            : "cursor-pointer bg-white/30 hover:bg-white/40 border border-white/50"
                    }`}
                    onClick={handleSubmit}
                    disabled={isButtonDisabled()}
                >
                    {loading ? "Chargement..." : "Connexion"}
                </button>

                <p
                    className="hover:underline w-fit cursor-pointer mt-4 mx-auto text-sm text-white/80"
                    onClick={() => navigate("/register")}
                >
                    Pas encore inscrit ? Crée un compte
                </p>
            </div>
        </div>
    );
}
