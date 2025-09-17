import {useState} from "react";
import useUserStore from "../stores/userStore.ts";
import {useNavigate} from "react-router";
import {isValidEmail, isValidPassword} from "../utils/utils.ts";
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
    })
    const [registerError, setRegisterError] = useState<RegisterErrors>({})
    const [globalError, setGlobalError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const {registerUser} = useUserStore()

    const navigate = useNavigate();

    const handleChangeInputs = (input: "email" | "password", value: string) => {
        setRegister(prev => ({
            ...prev,
            [input]: value
        }));
    }

    const isButtonDisabled = () => {
        const isEmailNotValid = register.email.trim() == ""
        const isPasswordNotValid = register.password.trim() == ""

        return isEmailNotValid || isPasswordNotValid
    }

    const handleSubmit = async () => {
        setLoading(true);

        const errors: RegisterErrors = {};

        const isEmailValid = isValidEmail(register.email)
        const isPasswordValid = isValidPassword(register.password)

        if (!isPasswordValid) errors.password = "Le mot de passe doit contenir :\n• 8 caractères minimum\n• 1 majuscule\n• 1 minuscule\n• 1 chiffre\n• 1 caractère spécial"
        if (!isEmailValid) errors.email = "Format de mail invalide."

        if (Object.keys(errors).length > 0) {
            setRegisterError(errors);
            setLoading(false);
            return;
        }

        try {
            await registerUser(register.email, register.password)
            setLoading(false);
            navigate("/login");
        } catch (error) {
            setGlobalError((error as Error).message)
            setLoading(false);
        }
    }

    return (
        <div className="p-4 w-1/3 mx-auto border border-black/25 rounded-md mt-10 py-14 px-10">
            <p className="text-3xl text-center mb-5">Inscription</p>
            {globalError && (
                <p className="text-center mt-5 text-red-600">{globalError}</p>
            )}
            <div className="mt-5">
                <label htmlFor="email" className="mb-2 text-lg">Email</label>
                <Input value={register.email} onChange={handleChangeInputs} type={"email"}/>
                {
                    registerError.email && (
                        <p>{registerError.email}</p>
                    )
                }
            </div>
            <div className="mt-4">
                <label htmlFor="password" className="mb-2 text-lg">Password</label>
                <Input value={register.password} onChange={handleChangeInputs} type={"password"} isPassword/>
                {
                    registerError.password && (
                        <p>{registerError.password}</p>
                    )
                }
            </div>
            <button
                className={`border rounded-md px-2 py-1 mt-5 w-full ${isButtonDisabled() ? "cursor-not-allowed bg-gray-300 text-gray-700 border-gray-400" : "cursor-pointer hover:bg-gray-100"}`}
                onClick={handleSubmit}
                disabled={isButtonDisabled()}
            >
                {
                    loading ? "Chargement" : "Enregistrer"
                }
            </button>
            <p
                className="hover:underline w-fit cursor-pointer mt-2 mx-auto"
                onClick={() => navigate("/login")}
            >
                Connexion
            </p>
        </div>
    )
}