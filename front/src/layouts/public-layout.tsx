import {useEffect, useState} from "react";
import { Navigate } from 'react-router-dom';
import useUserStore from "../stores/userStore.ts";
import Loader from "../components/loader.tsx";

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({children}: PublicLayoutProps) {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {decodeToken, isAuthenticated} = useUserStore()

    useEffect(() => {
        const token = localStorage.getItem("token");
        void decodeToken(token ?? "").finally(() => {
            setIsLoading(false)
        });
    }, []);

    if (isLoading) return <Loader />

    if (isAuthenticated) return <Navigate to="/" replace />;

    return <>{children}</>;
}