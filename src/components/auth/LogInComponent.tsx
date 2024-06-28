import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {Link} from "react-router-dom";

import {AuthContext} from "../../context/AuthContext";
import {NotificationContext} from "../../context/NotificationContext";
import {api} from "../../hooks/api";
import NotificationData from "../../interfaces/NotificationData";

const LogInComponent = (): React.JSX.Element => {
    const [, setToken] = useContext(AuthContext) as [string, Dispatch<SetStateAction<string | null>>];
    const setNotification = useContext(NotificationContext) as Dispatch<SetStateAction<NotificationData | null>>;

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const submitLogin = () => {
        api("/api/token", {}, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded",
            }),
            body: JSON.stringify(
                `grant_type=&username=${encodeURIComponent(emailOrUsername)}&password=${encodeURIComponent(password)}&scope=&client_id=&client_secret=`
            ),
        }).then(([status, data]) => {
            if (status === 500) {
                setErrorMessage(data);
            } else if (status !== 200) {
                setErrorMessage(data.detail);
            } else {
                setErrorMessage("");

                setToken(data["access_token"]);

                setNotification({
                    color: "bg-green-600 text-navy-50",
                    text: "Successfully logged in",
                });
            }
        });
    }

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        submitLogin();
    }

    return (
        <div className="flex items-center justify-center bg-navy-800
                        w-full h-full
                        sm:w-[448px] sm:h-[448px]
                        sm:rounded-xl sm:shadow-lg sm:shadow-navy-900 sm:border-2 sm:border-navy-900">
            <form onSubmit={handleSubmit}
                  className="relative grid gap-2 flex-1 justify-items-center
                             sm:gap-4">
                <div className="w-4/5 mb-2">
                    <h1 className="text-4xl font-bold text-navy-50">
                        Log In
                    </h1>
                </div>
                <div className="grid justify-items-center w-full">
                    <div className="w-4/5">
                        <label className="text-sm text-navy-200">
                            E-Mail Address or Username
                        </label>
                    </div>
                    <input
                        type="text"
                        placeholder="example@example.com"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        className="w-4/5 h-10 pl-2 rounded-md bg-navy-900
                                   text-base text-navy-50
                                   placeholder:text-base placeholder:text-navy-500 focus:outline-none"
                        required
                    />
                </div>
                <div className="grid justify-items-center w-full">
                    <div className="w-4/5">
                        <label className="text-sm text-navy-200">
                            Password
                        </label>
                    </div>
                    <input
                        type="password"
                        placeholder="*****"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-4/5 h-10 pl-2 rounded-md bg-navy-900
                                   text-base text-navy-50
                                   placeholder:text-base placeholder:text-navy-500 focus:outline-none"
                        required
                    />
                    <div className="w-4/5">
                        <Link to="/signup" className="text-xs text-blue-400 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                </div>
                <div className="flex justify-center items-center w-fit h-10">
                    {
                        errorMessage &&
                        <span className="text-base text-deep-red-400">
                            {errorMessage}
                        </span>
                    }
                </div>
                <div className="flex flex-row justify-around w-4/5">
                    <div className="flex flex-col justify-end mx-1">
                        <button type="submit"
                                className="flex justify-center items-center w-[150px] h-[40px]
                                           bg-blue-500 rounded border-2 border-blue-500
                                           hover:bg-blue-600 hover:border-blue-600
                                           font-bold text-navy-50 text-nowrap">
                            Log in
                        </button>
                    </div>
                    <div className="flex flex-col mx-1 text-center">
                        <span className="mb-1 font-bold text-xs text-navy-200">
                            No account yet?
                        </span>
                        <Link to="/signup"
                              className="flex justify-center items-center w-[150px] h-[40px]
                                         bg-transparent rounded border-2 border-blue-600
                                         hover:bg-blue-600
                                         font-bold text-navy-50 text-nowrap">
                            Sign up
                        </Link>
                    </div>
                </div>
            </form>
        </div>
);
}

export default LogInComponent;
