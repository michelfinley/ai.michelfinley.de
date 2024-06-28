import React, {Dispatch, SetStateAction, useContext, useEffect, useRef} from 'react';
import {Navigate} from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import SignUpComponent from "../../components/auth/SignUpComponent";
import {AuthContext} from "../../context/AuthContext";

function SignUp() {
    const [token,] = useContext(AuthContext) as [string, Dispatch<SetStateAction<string | null>>];

    const ignoreEffect = useRef<boolean>(false);
    useEffect(() => {
        if (!ignoreEffect.current) {
            ignoreEffect.current = true;

            document.title = "Sign up | @i";
        }
    }, []);

    return (
        <AuthHeader>
            {
                token === "null" ? (
                    <SignUpComponent/>
                ) : (
                    <Navigate to="/"/>
                )
            }
        </AuthHeader>
    );
}

export default SignUp;
