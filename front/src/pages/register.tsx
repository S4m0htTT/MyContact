import { useState } from "react";
import useUserStore from "../stores/userStore.ts";
import { useNavigate } from "react-router";
import { isValidEmail, isValidPassword } from "../utils/utils.ts";
import Input from "../components/input.tsx";

interface RegisterInputs {
    email: string;
    password: string;
}

interface RegisterErrors {
    email?: string;
    password?: string;
}

export default function Register() {
    const [register, setRegister] = useState<RegisterInputs>({
        email: "",
        password: ""
    });
    const [registerError, setRegisterError] = useState<RegisterErrors>({});
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { registerUser } = useUserStore();
    const navigate = useNavigate();

    const handleChangeInputs = (input: "email" | "password", value: string) => {
        setRegister(prev => ({
            ...prev,
            [input]: value
        }));
    };

    const isButtonDisabled = () => {
        return register.email.trim() === "" || register.password.trim() === "";
    };

    const handleSubmit = async () => {
        setLoading(true);
        const errors: RegisterErrors = {};

        if (!isValidEmail(register.email)) {
            errors.email = "Format de mail invalide.";
        }
        if (!isValidPassword(register.password)) {
            errors.password =
                "Le mot de passe doit contenir :\n• 8 caractères minimum\n• 1 majuscule\n• 1 minuscule\n• 1 chiffre\n• 1 caractère spécial";
        }

        if (Object.keys(errors).length > 0) {
            setRegisterError(errors);
            setLoading(false);
            return;
        }

        try {
            await registerUser(register.email, register.password);
            setLoading(false);
            navigate("/login");
        } catch (error) {
            setGlobalError((error as Error).message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-full max-w-md p-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg shadow-white/10 text-white">
                <p className="text-3xl text-center mb-5 font-semibold">Inscription</p>

                {globalError && (
                    <p className="text-center mt-5 text-red-400">{globalError}</p>
                )}

                <div className="mt-5">
                    <label htmlFor="email" className="mb-2 text-lg block">Email</label>
                    <Input
                        value={register.email}
                        onChange={handleChangeInputs}
                        type="email"
                        id="email"
                    />
                    {registerError.email && (
                        <p className="text-sm text-red-300 mt-1 whitespace-pre-line">{registerError.email}</p>
                    )}
                </div>

                <div className="mt-4">
                    <label htmlFor="password" className="mb-2 text-lg block">Mot de passe</label>
                    <Input
                        value={register.password}
                        onChange={handleChangeInputs}
                        type="password"
                        isPassword
                        id="password"
                    />
                    {registerError.password && (
                        <p className="text-sm text-red-300 mt-1 whitespace-pre-line">{registerError.password}</p>
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
                    {loading ? "Chargement..." : "Enregistrer"}
                </button>

                <p
                    className="hover:underline w-fit cursor-pointer mt-4 mx-auto text-sm text-white/80"
                    onClick={() => navigate("/login")}
                >
                    Déjà inscrit ? Connexion
                </p>
            </div>
        </div>
    );
}
