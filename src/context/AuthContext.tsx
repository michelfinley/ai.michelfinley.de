import React, {createContext, useEffect, useRef, useState} from "react";

import {api} from "../hooks/api";
import {getCookie, setCookie} from "../hooks/cookies";
import MyAccountData from "../interfaces/MyAccountData";

export const AuthContext: React.Context<{}> = createContext({});

export const MyAccountContext: React.Context<{}> = createContext({});

export const AuthProvider = (props: any) => {
    const [token, setToken] = useState<string>(getCookie("token"));

    const [myAccountData, setMyAccountData] = useState<MyAccountData>({
        id: -1,
        email: "",
        username: "",
    });

    let ignoreEffect = useRef<string>("invalid_token");

    useEffect(() => {
        if (ignoreEffect.current !== token) {
            ignoreEffect.current = token || "";

            setCookie("token", token);

            api("/api/users/me", {}, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            }).then(([status, data]) => {
                if (status !== 200) {
                    setToken("null");
                } else {
                    setMyAccountData({
                        id: data["id"],
                        username: data["username"],
                        email: data["email"],
                    });
                }
            });
        }
    }, [token]);

    return (
        <AuthContext.Provider value={[token, setToken]}>
            <MyAccountContext.Provider value={[myAccountData, setMyAccountData]}>
                {props.children}
            </MyAccountContext.Provider>
        </AuthContext.Provider>
    )
};
