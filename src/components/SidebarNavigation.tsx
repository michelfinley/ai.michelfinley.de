import React from "react";
import {Link} from "react-router-dom";

import {useLogOut} from "../hooks/api";

const SidebarNavigation = (): React.JSX.Element => {
    const logOut = useLogOut();

    return (
        <div className="w-full h-full bg-navy-800">
            <div className="relative flex flex-col h-fit pl-4 mr-4">
                <div className="absolute w-[1px] h-full bottom-0 top-0 left-0 bg-navy-700"/>
                <section>
                    <Link to="/myaccount"
                          className="flex flex-row items-center w-fit mt-4 mb-1 text-navy-50
                                     hover:text-navy-400">
                        <span className="material-symbols material-symbols-outlined">person</span>
                        <span className="ml-2 text-lg font-semibold">
                            My account
                        </span>
                    </Link>

                    <div className="flex flex-col ml-8 text-navy-50">
                        <Link to="/login" onClick={logOut}
                              className="flex justify-around items-center w-fit m-2
                                         hover:text-navy-400">
                            <span className="material-symbols material-symbols-outlined material-symbol-md">
                                logout
                            </span>
                            <span className="ml-2 text-base font-semibold">
                                Logout
                            </span>
                        </Link>
                        <Link to="/myaccount/settings"
                              className="flex justify-around items-center w-fit m-2
                                         hover:text-navy-400">
                            <span className="material-symbols material-symbols-outlined material-symbol-md">
                                settings
                            </span>
                            <span className="ml-2 text-base font-semibold">
                                Settings
                            </span>
                        </Link>
                    </div>
                </section>

                <section>
                    <Link to="/myaccount/following"
                          className="flex justify-around items-center w-fit mt-4 mb-1 text-navy-50
                                     hover:text-navy-400 ">
                        <span className="material-symbols material-symbols-outlined">group</span>
                        <span className="ml-2 text-lg font-semibold">
                            Following
                        </span>
                    </Link>
                </section>

                <section>
                    <Link to="/myaccount/favorites"
                          className="flex justify-around items-center w-fit mt-4 mb-1 group">
                        <span className="material-symbols text-red-400
                                         group-hover:text-red-500">favorite</span>
                        <span className="ml-2 text-lg font-semibold text-navy-50
                                         group-hover:text-navy-400">
                            Favorites
                        </span>
                    </Link>
                </section>

                <section>
                    <Link to="https://michelfinley.de/ai"
                          className="flex justify-around items-center w-fit mt-12 mb-1
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
    )
}

export default SidebarNavigation;
