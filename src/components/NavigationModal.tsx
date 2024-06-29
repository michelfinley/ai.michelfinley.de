import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {useLogOut} from "../hooks/api";


interface NavigationModalProps {
    isOpen: boolean,
    onClose: () => void,
}


const NavigationModal: React.FC<NavigationModalProps> = (
    {isOpen, onClose,}
) => {
    const [isModalOpen, setModalOpen] = useState(isOpen);
    const modalRef = useRef<HTMLDialogElement | null>(null);

    const mainElementRef = useRef<HTMLDivElement | null>(null);

    const logOut = useLogOut();

    const handleClose = useCallback(() => {
        onClose();
        setModalOpen(false);
    }, [onClose]);

    const handleLogout = () => {
        handleClose();

        logOut();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
        if (event.key === "Escape") {
            handleClose();
        }
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
                className="fixed w-[40%] min-w-fit h-full min-h-full top-0 bottom-0 right-0 left-auto m-0
                           bg-navy-800 shadow-2xl shadow-navy-900
                           backdrop:backdrop-brightness-50">

            <div ref={mainElementRef} className="relative flex items-center justify-center w-full h-full">

                <div className="w-full h-full bg-navy-800">
                    <button onClick={handleClose}
                            className="flex justify-center items-center top-0 left-0 m-2 px-4 py-2
                                       bg-navy-900 rounded-full text-navy-400
                                       focus:outline-none">
                        <span className="mt-[3px] material-symbols">arrow_back</span>
                        <span className="ml-1 font-semibold text-navy-400">Go Back</span>
                    </button>

                    <div className="relative flex flex-col h-fit pl-4 mr-16">
                        <section>
                            <Link to="/myaccount" onClick={handleClose}
                                  className="flex flex-row items-center w-fit mt-4 mb-2
                                             text-navy-50
                                             hover:text-navy-400">
                                <span className="material-symbols material-symbols-outlined">person</span>
                                <span className="ml-2 text-lg font-semibold">
                                    My account
                                </span>
                            </Link>

                            <div className="flex flex-col ml-12 text-navy-50">
                                <Link to="/login" onClick={handleLogout}
                                      className="flex justify-around items-center w-fit my-3
                                                 hover:text-navy-400">
                                    <span className="material-symbols material-symbols-outlined">logout</span>
                                    <span className="ml-2 text-lg font-semibold">
                                        Logout
                                    </span>
                                </Link>
                                <Link to="/myaccount/settings" onClick={handleClose}
                                      className="flex justify-around items-center w-fit my-3
                                                 hover:text-navy-400">
                                    <span className="material-symbols material-symbols-outlined">settings</span>
                                    <span className="ml-2 text-lg font-semibold">
                                        Settings
                                    </span>
                                </Link>
                            </div>
                        </section>

                        <section>
                            <Link to="/myaccount/following" onClick={handleClose}
                                  className="flex justify-around items-center w-fit my-3
                                             text-navy-50
                                             hover:text-navy-400">
                                <span className="material-symbols material-symbols-outlined">group</span>
                                <span className="ml-2 text-lg font-semibold">
                                    Following
                                </span>
                            </Link>
                        </section>

                        <section>
                            <Link to="/myaccount/favorites" onClick={handleClose}
                                  className="flex justify-around items-center w-fit my-3 group">
                                <span className="material-symbols text-red-400
                                                 group-hover:text-red-500">favorite</span>
                                <span className="ml-2 text-lg font-semibold text-navy-50
                                                 group-hover:text-navy-400">
                                    Favorites
                                </span>
                            </Link>
                        </section>

                        <section>
                            <Link to="https://michelfinley.de/ai" onClick={handleClose}
                                  className="flex justify-around items-center w-fit mt-3
                                             text-navy-50
                                             hover:text-navy-400">
                                <span className="material-symbols material-symbols-outlined">info</span>
                                <span className="ml-2 text-lg font-semibold">
                                    About @i
                                </span>
                            </Link>
                        </section>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default NavigationModal;
