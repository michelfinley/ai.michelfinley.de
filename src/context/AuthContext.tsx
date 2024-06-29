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

    const [cookieAgreed, setCookieAgreed] = useState<boolean>(false);

    const cookieAgreedRef = useRef<boolean>(false);

    const onCookieAgree = () => {
        setCookie("cookies", "true");
        setCookieAgreed(true);
        window.location.reload();
    };

    const ignoreEffect = useRef<string>("invalid_token");

    useEffect(() => {
        if (ignoreEffect.current !== token || cookieAgreedRef.current !== cookieAgreed) {
            ignoreEffect.current = token || "";
            cookieAgreedRef.current = cookieAgreed;

            if (getCookie("cookies") === "true") {
                if (!cookieAgreed) {
                    setCookieAgreed(true);
                }

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

            } else {
                setCookieAgreed(false);
                setCookie("cookies", "");
            }
        }
    }, [token]);

    const modalRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        const modalElement = modalRef.current;

        if (modalElement) {
            if (!cookieAgreed) {
                modalElement.showModal();
            } else {
                modalElement.close();
            }
        }

    }, [cookieAgreed]);

    return (
        <AuthContext.Provider value={[token, setToken]}>
            <MyAccountContext.Provider value={[myAccountData, setMyAccountData]}>
                {
                    cookieAgreed ? props.children
                        :
                        <dialog ref={modalRef} className="fixed w-full min-w-full min-h-full mx-0
                                           sm:w-[512px] sm:min-w-[512px] sm:h-[320px] sm:min-h-[320px] sm:m-auto
                                           bg-navy-800 sm:rounded-3xl sm:shadow-2xl sm:shadow-navy-900
                                           backdrop:backdrop-brightness-50">
                            <div className="relative flex flex-col items-center justify-center w-full h-full p-8">
                                <div className="text-navy-50">
                                    <div className="flex justify-start items-center w-full">
                                        <span className="material-symbols material-symbols-outlined material-symbol-3xl">info</span>
                                        <span className="ml-2 text-3xl font-semibold">Cookie notice</span>
                                    </div>
                                    <div className="h-4" />
                                    <span>
This website uses technically necessary cookies to provide user authentication.
By clicking on "Agree and continue", you agree to the use of these cookies.
If you do not agree to the use of cookies, you will not be able to use this website.<br/>
Further information can be found in the <a href="https://michelfinley.de/impressum#datenschutz"
                                           className="text-blue-400 underline
                                                      hover:text-blue-500 focus:outline-none">Privacy Policy</a>.
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center w-full mt-8">
                                    <button onClick={onCookieAgree}
                                            className="w-fit mx-8 p-3 bg-blue-500 rounded-xl text-navy-50 text-nowrap hover:bg-blue-600">
                                        Agree and continue
                                    </button>
                                    <div className="my-2" />
                                    <a href="https://michelfinley.de/ai"
                                       className="w-fit mx-8 p-3 bg-red-500 rounded-xl text-navy-50 text-nowrap hover:bg-red-600">
                                        Disagree and leave page
                                    </a>
                                </div>
                            </div>
                        </dialog>
                }
            </MyAccountContext.Provider>
        </AuthContext.Provider>
    )
};
