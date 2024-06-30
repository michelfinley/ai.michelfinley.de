import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {Link} from "react-router-dom";

import SettingsModal, {SettingsModalData, SettingType} from "../../components/myaccount/SettingsModal";

import {AuthContext, MyAccountContext} from "../../context/AuthContext";
import {NotificationContext} from "../../context/NotificationContext";
import {api, useLogOut} from "../../hooks/api";
import MyAccountData from "../../interfaces/MyAccountData";
import NotificationData from "../../interfaces/NotificationData";

function Settings() {
    const [, setToken] = useContext(AuthContext) as [string, Dispatch<SetStateAction<string | null>>];

    const [myAccountData, setMyAccountData] = useContext(MyAccountContext) as [MyAccountData, Dispatch<SetStateAction<MyAccountData>>];

    const setNotification = useContext(NotificationContext) as Dispatch<SetStateAction<NotificationData | null>>;

    const logOut = useLogOut();

    const updateAccountData = () => {
        api("/api/users/me", {}, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        }).then(([status, data]) => {
            if (status !== 200) {
                setToken(null);
            } else {
                setMyAccountData({
                    id: data["id"],
                    username: data["username"],
                    email: data["email"],
                });
            }
        });
    }

    const [isUsernameModalOpen, setChangeUsernameModalOpen] = useState<boolean>(false);
    const [isEmailModalOpen, setChangeEmailModalOpen] = useState<boolean>(false);
    const [isPasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setDeleteAccountModalOpen] = useState<boolean>(false);

    const openChangeUsernameModal = () => {
        setChangeUsernameModalOpen(true);
    };

    const closeChangeUsernameModal = () => {
        setChangeUsernameModalOpen(false);
    };

    const submitChangeUsernameForm = async (data: SettingsModalData): Promise<[boolean, string]> => {
        const [status, response] = await api("/api/users/me", {}, {
            method: "PUT",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                username: data.input,
                password_hash: data.password
            }),
        });
        if (status === 200) {
            updateAccountData();
            closeChangeUsernameModal();

            setNotification({
                color: "bg-green-600 text-navy-50",
                text: "Username changed successfully!",
            });
            return [true, ""];
        } else {
            return [false, response["detail"]];
        }
    };

    const openChangeEmailModal = () => {
        setChangeEmailModalOpen(true);
    };

    const closeChangeEmailModal = () => {
        setChangeEmailModalOpen(false);
    };

    const submitChangeEmailForm = async (data: SettingsModalData): Promise<[boolean, string]> => {
        const [status, response] = await api("/api/users/me", {}, {
            method: "PUT",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                email: data.input,
                password_hash: data.password
            }),
        });
        if (status === 200) {
            updateAccountData();
            closeChangeEmailModal();

            setNotification({
                color: "bg-green-600 text-navy-50",
                text: "E-Mail Address changed successfully!",
            });
            return [true, ""];
        } else {
            return [false, response["detail"]];
        }
    };

    const openChangePasswordModal = () => {
        setChangePasswordModalOpen(true);
    };

    const closeChangePasswordModal = () => {
        setChangePasswordModalOpen(false);
    };

    const submitChangePasswordForm = async (data: SettingsModalData): Promise<[boolean, string]> => {
        if (data.input !== data.inputConfirm) {
            return [false, "Passwords don't match"];
        }

        const [status, response] = await api("/api/users/me", {}, {
            method: "PUT",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                new_password: data.input,
                password_hash: data.password
            }),
        });
        if (status === 200) {
            updateAccountData();
            closeChangePasswordModal();

            setNotification({
                color: "bg-green-600 text-navy-50",
                text: "Password changed successfully!",
            });
            return [true, ""];
        } else {
            return [false, response["detail"]];
        }
    };

    const openDeleteAccountModal = () => {
        setDeleteAccountModalOpen(true);
    };

    const closeDeleteAccountModal = () => {
        setDeleteAccountModalOpen(false);
    };

    const submitDeleteAccountForm = async (data: SettingsModalData): Promise<[boolean, string]> => {
        if (data.input !== "DELETE") {
            return [false, "Type \"DELETE\" to confirm account deletion"];
        }

        const [status, response] = await api("/api/users/me", {}, {
            method: "DELETE",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                password_hash: data.password
            }),
        });
        if (status === 200) {
            updateAccountData();
            closeDeleteAccountModal();

            setToken(null);

            setNotification({
                color: "bg-red-600 text-navy-50",
                text: "Account deleted",
            });
            return [true, ""];
        } else {
            return [false, response["detail"]];
        }
    };

    return (
        <>
            <div className="absolute top-0 left-0 pl-2 pt-1">
                <Link to="/myaccount" className="flex flex-row items-center justify-center text-navy-500 text-nowrap">
                    <span className="material-symbols material-symbol-md mt-0.5">arrow_back</span>
                    <span className="ml-1 text-base font-semibold">
                        Back to Account Overview
                    </span>
                </Link>
            </div>
            <div className="flex flex-row justify-start sm:justify-center items-center w-full mt-8 px-8 text-navy-300">
                <span className="material-symbols material-symbol-3xl material-symbols-outlined">settings</span>
                <span className="ml-2 text-3xl font-bold">
                    <span className="hidden sm:inline">Account Settings</span>
                    <span className="inline sm:hidden">Settings</span>
                </span>
            </div>
            <div className="flex flex-col h-fit mt-8">
                <div className="flex flex-row justify-between items-center mx-4 sm:mx-8 mb-2">
                    <div className="flex flex-row justify-center items-center w-fit min-w-0 text-navy-50">
                        <span className="hidden sm:inline">
                            <span className="material-symbols material-symbols-outlined">person</span>
                        </span>
                        <span className="flex flex-col min-w-0 ml-2
                                         font-semibold text-nowrap
                                         sm:inline sm:truncate">
                            <span>Username:</span>
                            <span className="min-w-0 mt-1 sm:mt-0 sm:ml-2 font-semibold text-sm text-navy-400 truncate">
                                {myAccountData.username}
                            </span>
                        </span>
                    </div>
                    <button onClick={openChangeUsernameModal}
                            className="w-fit px-3 py-2 bg-navy-500 rounded-lg
                                       hover:bg-navy-600
                                       sm:px-4 sm:py-3">
                        <div className="flex flex-row justify-center items-center text-navy-50">
                            <span className="flex sm:hidden justify-center items-center">
                                <span className="material-symbols material-symbols-outlined material-symbol-sm">
                                    edit
                                </span>
                            </span>
                            <span className="hidden sm:flex justify-center items-center">
                                <span className="material-symbols material-symbols-outlined">
                                    edit
                                </span>
                            </span>
                            <span className="ml-2 font-semibold">
                                Change
                            </span>
                        </div>
                    </button>
                </div>
                <div className="flex flex-row justify-between items-center mx-4 sm:mx-8 my-2">
                    <div className="flex flex-row justify-center items-center w-fit min-w-0 text-navy-50">
                        <span className="hidden sm:inline">
                            <span className="material-symbols material-symbols-outlined">person</span>
                        </span>
                        <span className="flex flex-col min-w-0 ml-2
                                         font-semibold text-nowrap
                                         sm:inline sm:truncate">
                            <span className="hidden sm:inline">E-Mail Address:</span>
                            <span className="inline sm:hidden">E-Mail:</span>
                            <span className="min-w-0 mt-1 sm:mt-0 sm:ml-2 font-semibold text-sm text-navy-400 truncate">
                                {myAccountData.email}
                            </span>
                        </span>
                    </div>
                    <button onClick={openChangeEmailModal}
                            className="w-fit px-3 py-2 bg-navy-500 rounded-lg
                                       hover:bg-navy-600
                                       sm:px-4 sm:py-3">
                        <div className="flex flex-row justify-center items-center text-navy-50">
                            <span className="flex sm:hidden justify-center items-center">
                                <span className="material-symbols material-symbols-outlined material-symbol-sm">
                                    edit
                                </span>
                            </span>
                            <span className="hidden sm:flex justify-center items-center">
                                <span className="material-symbols material-symbols-outlined">
                                    edit
                                </span>
                            </span>
                            <span className="ml-2 font-semibold">
                                Change
                            </span>
                        </div>
                    </button>
                </div>
                <div className="flex flex-row justify-between items-center mx-4 sm:mx-8 my-2">
                    <div className="flex flex-row justify-center items-center w-fit min-w-0 text-navy-50">
                        <span className="hidden sm:inline">
                            <span className="material-symbols material-symbols-outlined">person</span>
                        </span>
                        <span className="flex flex-col min-w-0 ml-2
                                         font-semibold text-nowrap
                                         sm:inline sm:truncate">
                            <span>Password:</span>
                            <span
                                className="min-w-0 mt-1 sm:mt-0 sm:ml-2 font-semibold text-sm text-navy-400 truncate">
                                ***
                            </span>
                        </span>
                    </div>
                    <button onClick={openChangePasswordModal}
                            className="w-fit px-3 py-2 bg-navy-500 rounded-lg
                                       hover:bg-navy-600
                                       sm:px-4 sm:py-3">
                        <div className="flex flex-row justify-center items-center text-navy-50">
                            <span className="flex sm:hidden justify-center items-center">
                                <span className="material-symbols material-symbols-outlined material-symbol-sm">
                                    edit
                                </span>
                            </span>
                            <span className="hidden sm:flex justify-center items-center">
                                <span className="material-symbols material-symbols-outlined">
                                    edit
                                </span>
                            </span>
                            <span className="ml-2 font-semibold">
                                Change
                            </span>
                        </div>
                    </button>
                </div>
                <div className="flex flex-row justify-between items-center mx-4 sm:mx-8 my-6">
                    <div/>
                    <button onClick={logOut}
                            className="w-fit px-3 py-1.5 bg-oxblood-500 rounded-lg
                                       hover:bg-oxblood-600
                                       sm:px-4 sm:py-3">
                        <div className="flex flex-row justify-center items-center text-navy-50">
                            <span className="inline sm:hidden mt-1">
                                <span
                                    className="material-symbols material-symbols-outlined material-symbol-sm">
                                    logout
                                </span>
                            </span>
                            <span className="hidden sm:flex justify-center items-center">
                                <span className="material-symbols material-symbols-outlined">
                                    logout
                                </span>
                            </span>
                            <span className="ml-2 font-semibold">
                                Logout
                            </span>
                        </div>
                    </button>
                </div>
                <div className="my-4">
                </div>
                <button onClick={openDeleteAccountModal}
                        className="mx-4 sm:mx-8 my-2 px-4 py-3 bg-red-500 rounded-lg
                                   hover:bg-red-600">
                    <div className="flex flex-row justify-center items-center text-navy-50">
                        <span className="material-symbols material-symbols-outlined">delete</span>
                        <span className="ml-2 font-semibold truncate">
                            Delete Account
                        </span>
                    </div>
                </button>
            </div>

            <SettingsModal
                isOpen={isUsernameModalOpen}
                onSubmit={submitChangeUsernameForm}
                onClose={closeChangeUsernameModal}
                settingType={SettingType.username}
            />

            <SettingsModal
                isOpen={isEmailModalOpen}
                onSubmit={submitChangeEmailForm}
                onClose={closeChangeEmailModal}
                settingType={SettingType.email}
            />

            <SettingsModal
                isOpen={isPasswordModalOpen}
                onSubmit={submitChangePasswordForm}
                onClose={closeChangePasswordModal}
                settingType={SettingType.password}
            />

            <SettingsModal
                isOpen={isDeleteModalOpen}
                onSubmit={submitDeleteAccountForm}
                onClose={closeDeleteAccountModal}
                settingType={SettingType.delete}
            />
        </>
    );
}

export default Settings;
