import {Outlet, useNavigate} from "react-router";
import {useEffect} from "react";

export default function ProtectedLayout(){
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token?.trim() == "") navigate("/login");
    }, []);

    return (
        <div>
            <Outlet />
        </div>
    )
}