import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import NotFound from "./pages/not-found.tsx";
import Home from "./pages/home.tsx";
import AuthLayout from "./layouts/auth-layout.tsx";
import ProtectedLayout from "./layouts/protected-layout.tsx";


createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route element={<App/>}>
                <Route element={<AuthLayout/>}>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Route>
                <Route element={<ProtectedLayout/>}>
                    <Route path="/" element={<Home/>}/>
                </Route>
            </Route>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    </BrowserRouter>,
)
