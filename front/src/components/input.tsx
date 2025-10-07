import {Eye, EyeOff} from "lucide-react";
import {useState} from "react";

interface InputProps {
    value: string;
    onChange: (type: "email" | "password", value: string) => void;
    isPassword?: boolean;
    type: "password" | "email";
    id: string;
}

export default function Input({value, onChange, isPassword = false, type, id}: InputProps) {

    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="relative w-full">
            <input
                id={id}
                type={type !== "password" ? type : showPassword ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(type, e.target.value)}
                className="bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 rounded-md px-3 py-2 w-full focus:outline-none"
            />
            {isPassword ? showPassword ?
                (
                    <EyeOff
                        strokeWidth={1.5}
                        color="#FFF"
                        className="cursor-pointer absolute top-1/2 right-3 -translate-y-1/2"
                        onClick={() => setShowPassword(false)}
                    />
                ) : (
                    <Eye
                        strokeWidth={1.5}
                        color="#FFF"
                        className="cursor-pointer absolute top-1/2 right-3 -translate-y-1/2"
                        onClick={() => setShowPassword(true)}
                    />
                ) : (
                <></>
            )}
        </div>
    )
}