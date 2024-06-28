import React, {Dispatch, SetStateAction, useContext, useEffect, useRef} from 'react';
import {Navigate, useLocation} from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import LogInComponent from "../../components/auth/LogInComponent";
import {AuthContext} from "../../context/AuthContext";

function Login() {
    const [token,] = useContext(AuthContext) as [string, Dispatch<SetStateAction<string | null>>];

    const { state } = useLocation();

    const ignoreEffect = useRef<boolean>(false);
    useEffect(() => {
        if (!ignoreEffect.current) {
            ignoreEffect.current = true;

            document.title = "Log in | @i";
        }
    }, []);

    return (
        <AuthHeader>
            {
                token === "null" ? (
                    <LogInComponent/>
                ) : (
                    <Navigate to={state?.path || "/"}/>
                )
            }
        </AuthHeader>
    );
}

export default Login;
