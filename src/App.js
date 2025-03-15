import { BrowserRouter, Routes, Route } from "react-router";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import LayoutApp from './utils/layout/app.layout.js';
import LayoutPage from './utils/layout/page.layout.js';
import Protected from "./utils/protected.route.js";

import { AuthContext } from "./utils/context/auth.context.ts";
import { AppContext } from "./utils/context/app.context.js";

import { useAuth } from "./utils/hooks/auth.hook.js";
import { useApp } from "./utils/hooks/app.hook.js";

import NotFound from "./pages/notfoud";
import Login from './pages/login';
import Home from './pages/home';
import HRS from "./pages/hr";
import PRO from "./pages/pro";
import CON from "./pages/cont";
import COT from "./pages/cot";

export default function App() {
    const auth = useAuth();
    const app = useApp();

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={process.env.REACT_APP_RECAPTCHA_KEY}
            language="es"
        >
            <AuthContext.Provider value={{ ...auth }}>
                <AppContext.Provider value={{...app }}>
                    <BrowserRouter>
                        <Routes>
                            <Route element={<LayoutPage />}>

                                <Route path="/" element={<Login />} />
                                <Route path="/login" element={<Login />} />

                                <Route element={<Protected />}>

                                    <Route element={<LayoutApp />}>
                                        <Route path="home" element={<Home />} />
                                        <Route path="hr" element={<HRS />} />
                                        <Route path="pro" element={<PRO />} />
                                        <Route path="con" element={<CON />} />
                                        <Route path="cot" element={<COT />} />
                                    </Route>

                                </Route>

                                <Route path="*" element={<NotFound />} />
                            </Route>
                        </Routes>

                    </BrowserRouter>
                </AppContext.Provider>
            </AuthContext.Provider>
        </GoogleReCaptchaProvider>
    );
}