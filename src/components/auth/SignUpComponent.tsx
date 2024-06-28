import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {Link} from "react-router-dom";

import {AuthContext} from "../../context/AuthContext";
import {NotificationContext} from "../../context/NotificationContext";
import {api} from "../../hooks/api";
import NotificationData from "../../interfaces/NotificationData";

const SignUpComponent = (): React.JSX.Element => {

    const [, setToken] = useContext(AuthContext) as [string, Dispatch<SetStateAction<string | null>>];
    const setNotification = useContext(NotificationContext) as Dispatch<SetStateAction<NotificationData | null>>;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const submitSignUp = () => {
        api("/api/users", {}, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                username: encodeURIComponent(username), email: encodeURIComponent(email),
                password_hash: encodeURIComponent(password)
            }),
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
                    text: "Registration successful",
                });
            }
        });
    }

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (password === confirmPassword) {
            if (password.length >= 6) {
                submitSignUp();
            } else {
                setErrorMessage("Password must contain at least six characters")
            }
        } else {
            setErrorMessage("Passwords don't match")
        }
    }

    return (
        <div className="flex items-center justify-center bg-navy-800
                        w-full h-full
                        sm:w-[448px] sm:h-[546px]
                        sm:rounded-xl sm:shadow-lg sm:shadow-navy-900 sm:border-2 sm:border-navy-900">
            <form onSubmit={handleSubmit}
                  className="relative grid gap-2 flex-1 justify-items-center">
                <div className="w-4/5 mb-2">
                    <h1 className="text-4xl font-bold text-navy-50">
                        Sign Up
                    </h1>
                </div>
                <div className="grid justify-items-center w-full">
                    <div className="w-4/5">
                        <label className="text-xs text-navy-200">
                            Username
                        </label>
                    </div>
                    <input
                        type="text"
                        placeholder="John Smith"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-4/5 h-8 pl-2 rounded-md bg-navy-900
                                   text-sm text-navy-50
                                   placeholder:text-sm placeholder:text-navy-500 focus:outline-none"
                        required
                    />
                </div>
                <div className="grid justify-items-center w-full">
                    <div className="w-4/5">
                        <label className="text-xs text-navy-200">
                            E-Mail Address
                        </label>
                    </div>
                    <input
                        type="email"
                        placeholder="john_smith@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-4/5 h-8 pl-2 rounded-md bg-navy-900
                                   text-sm text-navy-50
                                   placeholder:text-sm placeholder:text-navy-500 focus:outline-none"
                        required
                    />
                </div>
                <div className="grid justify-items-center w-full">
                    <div className="w-4/5">
                        <label className="text-xs text-navy-200">
                            Password
                        </label>
                    </div>
                    <input
                        type="password"
                        placeholder="Type password here"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-4/5 h-8 pl-2 rounded-md bg-navy-900
                                   text-sm text-navy-50
                                   placeholder:text-sm placeholder:text-navy-500 focus:outline-none"
                        required
                    />
                </div>
                <div className="grid justify-items-center w-full">
                    <div className="w-4/5">
                        <label className="text-xs text-navy-200">
                            Confirm Password
                        </label>
                    </div>
                    <input
                        type="password"
                        placeholder="Type password again"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-4/5 h-8 pl-2 rounded-md bg-navy-900
                                   text-sm text-navy-50
                                   placeholder:text-sm placeholder:text-navy-500 focus:outline-none"
                        required
                    />
                </div>
                <div className="grid justify-items-center w-full">
                    <div className="w-4/5">
                        <label className="text-xs text-navy-200">
                            All fields are mandatory
                        </label>
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
                            Sign up
                        </button>
                    </div>
                    <div className="flex flex-col mx-1 text-center">
                        <span className="mb-1 font-bold text-xs text-navy-200">
                            Already have an account?
                        </span>
                        <Link to="/login"
                              className="flex justify-center items-center w-[150px] h-[40px]
                                         bg-transparent rounded border-2 border-blue-600
                                         hover:bg-blue-600
                                         font-bold text-navy-50 text-nowrap">
                            Log in
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SignUpComponent;