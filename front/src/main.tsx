import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import NotFound from "./pages/not-found.tsx";
import Home from "./pages/home.tsx";
import PublicLayout from "./layouts/public-layout.tsx";
import {StrictMode} from "react";
import AuthLayout from "./layouts/auth-layout.tsx";
import EditContact from "./pages/edit-contact.tsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <PublicLayout>
                <Login/>
            </PublicLayout>
        )
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "*",
        element: <NotFound/>,
    },
    {
        path: "/",
        element: (
            <AuthLayout>
                <App/>
            </AuthLayout>
        ),
        children: [
            {path: "/", element: <Home/>},
            {path: "/edit/:id", element: <EditContact/>}
        ]
    }
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
)
