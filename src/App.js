import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import LayoutApp from './utils/app.layout';
import LayoutPage from './utils/page.layout';

import Login from './pages/login/login.page';
import Home from './pages/home/home.page';

import { AuthContext } from "./utils/auth.context.ts";
import { useAuth } from "./utils/auth.hook.ts";

export default function App() {
    const { user, login, logout, setUser } = useAuth();

    return (
        <AuthContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
            <Routes>

                <Route element={<LayoutPage />}>
                  
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />

                        <Route element={<LayoutApp />}>
                            <Route path="home" element={<Home />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    
                </Route>

            </Routes>


        </BrowserRouter>
        </AuthContext.Provider>
    );
}