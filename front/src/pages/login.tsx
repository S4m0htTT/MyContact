import {useState} from "react";

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
    })
    const [loginError, setLoginError] = useState<LoginErrors>({})
    const [loading, setLoading] = useState<boolean>(false)

    const handleChangeInputs = (input: "email" | "password", value: string) => {
        setLogin(prev => ({
            ...prev,
            [input]: value
        }));
    }

    const isButtonDisabled = () => {
        const isEmailNotValid = login.email.trim() == ""
        const isPasswordNotValid = login.password.trim() == ""

        return isEmailNotValid || isPasswordNotValid
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // const isEmailValid = true
            // const isPasswordValid = false

            setLoading(false);
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="p-4">
            <p>Connexion</p>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type={"email"}
                    value={login.email}
                    onChange={(e) => handleChangeInputs("email", e.target.value)}
                    className="border"
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type={"password"}
                    value={login.password}
                    onChange={(e) => handleChangeInputs("password", e.target.value)}
                    className="border"
                />
            </div>
            <p>{isButtonDisabled() ? "true" : "false"}</p>
            <button
                className={`border px-2 ${isButtonDisabled() ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={handleSubmit}
                disabled={isButtonDisabled()}
            >
                Login
            </button>
        </div>
    )
}