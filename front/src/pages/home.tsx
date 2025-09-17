import useUserStore from "../stores/userStore.ts";
import {useNavigate} from "react-router";

export default function Home() {

    const {logout} = useUserStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <div>
            <p
                className="border px-2 w-fit cursor-pointer"
                onClick={handleLogout}
            >
                Logout
            </p>
            <p>Home page</p>
        </div>
    )
}