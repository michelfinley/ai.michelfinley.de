// Very helpful: https://blog.logrocket.com/creating-reusable-pop-up-modal-react/
// bzw. https://github.com/c99rahul/react-modal

import React, {useCallback, useEffect, useRef, useState} from "react";


export interface SettingsModalData {
    input: string,
    inputConfirm: string,
    password: string,
}


interface SettingsModalProps {
    isOpen: boolean,
    onSubmit: (data: SettingsModalData) => Promise<[boolean, string]>,
    onClose: () => void,

    settingType: SettingType,
}


interface SettingsModalStyle {
    windowHeight: string,

    title: string,
    titleIcon: string,
    titleColor: string,

    inputType: string,
    inputText: string,
    inputConfirmText?: string,
    inputPlaceholder: string,

    confirmButtonText: string,
    confirmButtonColor: string,
}


export class SettingType {
    static username = new SettingType({
        // Unfortunately these must always be written out so that TailwindCSS exports all necessary classes
        windowHeight: "sm:h-[320px] sm:min-h-[320px]",

        title: "Change Username",
        titleIcon: "edit",
        titleColor: "text-navy-50",

        inputType: "text",
        inputText: "New Username:",
        inputConfirmText: "",
        inputPlaceholder: "new username",

        confirmButtonText: "Confirm",
        confirmButtonColor: "bg-blue-500 hover:bg-blue-700",
    });
    static email = new SettingType({
        windowHeight: "sm:h-[320px] sm:min-h-[320px]",

        title: "Change E-Mail Address",
        titleIcon: "edit",
        titleColor: "text-navy-50",

        inputType: "email",
        inputText: "New E-Mail:",
        inputConfirmText: "",
        inputPlaceholder: "new email",

        confirmButtonText: "Confirm",
        confirmButtonColor: "bg-blue-500 hover:bg-blue-700",
    });
    static password = new SettingType({
        windowHeight: "sm:h-[384px] sm:min-h-[384px]",

        title: "Change Password",
        titleIcon: "edit",
        titleColor: "text-navy-50",

        inputType: "password",
        inputText: "New Password:",
        inputConfirmText: "Confirm Password:",
        inputPlaceholder: "new password",

        confirmButtonText: "Confirm",
        confirmButtonColor: "bg-blue-500 hover:bg-blue-700",
    });
    static delete = new SettingType({
        windowHeight: "sm:h-[320px] sm:min-h-[320px]",

        title: "Delete Account",
        titleIcon: "delete",
        titleColor: "text-deep-red-400",

        inputType: "text",
        inputText: "Type DELETE:",
        inputConfirmText: "",
        inputPlaceholder: "-",

        confirmButtonText: "Delete Account",
        confirmButtonColor: "bg-red-500 hover:bg-red-700",
    });

    style: SettingsModalStyle;

    constructor(style: SettingsModalStyle) {
        this.style = style;
    }
}


const SettingsModal: React.FC<SettingsModalProps> = (
    {isOpen, onSubmit, onClose, settingType,}
) => {
    const [isModalOpen, setModalOpen] = useState(isOpen);
    const modalRef = useRef<HTMLDialogElement | null>(null);

    const mainElementRef = useRef<HTMLDivElement | null>(null);

    const focusInputRef = useRef<HTMLInputElement | null>(null);

    const [formState, setFormState] = useState<SettingsModalData>({
        input: "",
        inputConfirm: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleClose = useCallback(() => {
        onClose();
        setModalOpen(false);

        setErrorMessage("");
        setFormState({
            input: "",
            inputConfirm: "",
            password: "",
        });
    }, [onClose]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
        if (event.key === "Escape") {
            handleClose();
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormState((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(formState).then(([ok, errMsg]) => {
            if (ok) {
                setFormState({
                    input: "",
                    inputConfirm: "",
                    password: "",
                });
                setErrorMessage("");
            } else {
                setErrorMessage(errMsg);
            }
        });
    };

    useEffect(() => {
        setModalOpen(isOpen)
    }, [isOpen]);

    useEffect(() => {
        const modalElement = modalRef.current;

        if (modalElement) {
            if (isModalOpen) {
                modalElement.showModal();
            } else {
                modalElement.close();
            }
        }

        if (isModalOpen && focusInputRef.current) {
            focusInputRef.current!.focus();
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (isModalOpen) {
            const onClick = (event: { target: any; }) => {
                if (mainElementRef.current && !mainElementRef.current.contains(event.target)) {
                    handleClose();
                }
            }

            document.addEventListener("mouseup", onClick);

            return () => {
                document.removeEventListener("mouseup", onClick);
            };
        }
    }, [handleClose, isModalOpen, mainElementRef]);

    return (
        <dialog ref={modalRef} onKeyDown={handleKeyDown}
                className={`fixed w-full min-w-full min-h-full mx-0
                            sm:w-[512px] sm:min-w-[512px] ${settingType.style.windowHeight} sm:m-auto
                            bg-navy-800 sm:rounded-3xl sm:shadow-2xl sm:shadow-navy-900
                            backdrop:backdrop-brightness-50`}>

            <div ref={mainElementRef} className="relative flex items-center justify-center w-full h-full">

                <button onClick={handleClose}
                        className="absolute hidden justify-center items-center top-0 right-0 w-8 h-8 m-2
                                   bg-navy-900 rounded-full
                                   sm:flex">
                    <span className="material-symbols text-navy-400">close</span>
                </button>

                <div className="flex flex-col justify-start items-start w-full h-full bg-navy-800">
                    <button onClick={handleClose}
                            className="flex justify-center items-center top-0 left-0 m-2 px-4 py-2
                                       bg-navy-900 rounded-full text-navy-400
                                       sm:hidden
                                       focus:outline-none">
                        <span className="mt-[3px] material-symbols">arrow_back</span>
                        <span className="ml-1 font-semibold text-navy-400">Go Back</span>
                    </button>

                    <div className="flex flex-grow items-center justify-center w-full">
                        <form onSubmit={handleSubmit} className="flex flex-col w-full px-6 sm:px-12">

                            <div className={`flex flex-row items-center my-4 ${settingType.style.titleColor}`}>
                                <span className="material-symbols material-symbols-outlined material-symbol-2xl">
                                    {settingType.style.titleIcon}
                                </span>
                                <span className="ml-2 text-2xl font-semibold truncate">
                                    {settingType.style.title}
                                </span>
                            </div>
                            <div className="flex flex-col justify-between items-start w-full my-2
                                            sm:flex-row sm:items-center">
                                <label className="text-navy-50 font-semibold mb-2 text-nowrap
                                                  sm:m-0">
                                    {settingType.style.inputText}
                                </label>
                                <div className="flex items-center justify-center w-full h-fit px-3 py-1.5
                                                bg-navy-900 rounded-full
                                                sm:w-60">
                                    <input
                                        ref={focusInputRef}
                                        type={settingType.style.inputType}
                                        name="input"
                                        value={formState.input}
                                        placeholder={settingType.style.inputPlaceholder}
                                        className="w-full bg-transparent
                                                   text-navy-50
                                                   placeholder:text-navy-500 placeholder:italic focus:outline-none"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            {
                                settingType === SettingType.password ?
                                    <>
                                        <div className="flex flex-col justify-between items-start w-full my-2
                                                        sm:flex-row sm:items-center">
                                            <label className="text-navy-50 font-semibold mb-2 sm:m-0 text-nowrap">
                                                {settingType.style.inputConfirmText}
                                            </label>
                                            <div className="flex items-center justify-center w-full h-fit px-3 py-1.5
                                                            bg-navy-900 rounded-full
                                                            sm:w-60">
                                                <input
                                                    type={settingType.style.inputType}
                                                    name="inputConfirm"
                                                    value={formState.inputConfirm}
                                                    placeholder={settingType.style.inputPlaceholder}
                                                    className="w-full bg-transparent
                                                               text-navy-50
                                                               placeholder:text-navy-500 placeholder:italic
                                                               focus:outline-none"
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <hr className="my-2 border-navy-400"/>
                                    </> : ""
                            }
                            <div className="flex flex-col justify-between items-start w-full my-2
                                            sm:flex-row sm:items-center">
                                <label className="mb-2 text-navy-50 font-semibold text-nowrap
                                                  sm:m-0">
                                    Current password:
                                </label>
                                <div className="flex items-center justify-center w-full h-fit px-3 py-1.5
                                                bg-navy-900 rounded-full
                                                sm:w-60">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formState.password}
                                        placeholder="current password"
                                        className="w-full bg-transparent
                                                   text-navy-50
                                                   placeholder:text-navy-500 placeholder:italic focus:outline-none"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex sm:hidden justify-center items-center w-full h-[3em]
                                            font-semibold text-deep-red-400 text-center">
                                <span>
                                    {errorMessage ? errorMessage : ""}
                                </span>
                            </div>
                            <div className="flex flex-row justify-center sm:justify-between items-center my-4">
                                <button type="submit"
                                        className={`w-full py-2
                                                    sm:w-auto sm:px-4
                                                    ${settingType.style.confirmButtonColor} rounded-2xl
                                                    font-semibold text-navy-50 text-nowrap`}>
                                    {settingType.style.confirmButtonText}
                                </button>
                                <div className="hidden sm:block mx-4"/>
                                <div className="hidden sm:flex justify-center items-center w-full h-[3em]
                                                font-semibold text-deep-red-400 text-center">
                                    <span>
                                        {errorMessage ? errorMessage : ""}
                                    </span>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="sm:hidden h-1/5"/>
                </div>
            </div>
        </dialog>
    );
};

export default SettingsModal;
