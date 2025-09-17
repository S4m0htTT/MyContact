import {Eye, EyeOff} from "lucide-react";
import {useState} from "react";

interface InputProps {
    value: string;
    onChange: (type: "email" | "password", value: string) => void;
    isPassword?: boolean;
    type: "password" | "email";
}

export default function Input({value, onChange, isPassword = false, type}: InputProps) {

    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="relative w-full">
            <input
                id={type}
                type={type === "email" ? "email" : showPassword ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(type, e.target.value)}
                className="border w-full px-2 py-1 rounded-md"
            />
            {isPassword ? showPassword ?
                (
                    <EyeOff
                        strokeWidth={1.5}
                        className="cursor-pointer absolute top-1/2 right-3 -translate-y-1/2"
                        onClick={() => setShowPassword(false)}
                    />
                ) : (
                    <Eye
                        strokeWidth={1.5}
                        className="cursor-pointer absolute top-1/2 right-3 -translate-y-1/2"
                        onClick={() => setShowPassword(true)}
                    />
                ) : (
                <></>
            )}
        </div>
    )
}