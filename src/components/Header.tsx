import React, {useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import SidebarNavigation from "./SidebarNavigation";
import SidebarRecommendations from "./SidebarRecommendations";
import NavigationModal from "./NavigationModal";

const Header = ({children}: { children: React.JSX.Element }) => {
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState<string>("");

    const searchInputElement = useRef<HTMLInputElement>(null);

    const focusSearchInput = () => {
        if (searchInputElement.current) {
            searchInputElement.current.focus();
        }
    }

    const submitSearch = () => {
        if (searchText) {
            navigate(`/search?q=${encodeURIComponent(searchText)}`);
        }
    }

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        submitSearch();
    }

    const deleteSearchText = () => {
        setSearchText("");
    }

    const [isNavigationModalOpen, setNavigationModalOpen] = useState<boolean>(false);

    const openNavigationModal = () => {
        setNavigationModalOpen(true);
    };

    const closeNavigationModal = () => {
        setNavigationModalOpen(false);
    };

    return (
        <div className="relative flex flex-col items-center w-full h-full m-0 bg-navy-800">
            <div className="fixed hidden
                            lg:flex flex-row w-full h-full top-0 bottom-0 left-0 right-0">
                <div className="flex flex-col w-fit min-w-[15%] max-w-[25%]">
                    <div className="relative h-[var(--header-height)] min-h-[var(--header-height)]">
                        <div className="absolute w-full h-[1px] bottom-0 left-0 right-0 pl-4">
                            <div className="w-full h-full bg-navy-700 translate-y-[1px]"/>
                        </div>
                    </div>
                    <div className="flex flex-grow">
                        <SidebarRecommendations/>
                    </div>
                </div>
                <div className="relative flex flex-grow h-[var(--header-height)] min-h-[var(--header-height)]">
                    <div className="absolute w-full h-[1px] bottom-0 left-0 right-0 bg-navy-700"/>
                </div>
                <div className="flex flex-col w-fit min-w-[15%] max-w-[25%]">
                    <div className="relative h-[var(--header-height)] min-h-[var(--header-height)]">
                        <div className="absolute w-full h-[1px] bottom-0 left-0 right-0 pr-4">
                            <div className="w-full h-full bg-navy-700 translate-y-[1px]"/>
                        </div>
                    </div>
                    <div className="flex flex-grow">
                        <SidebarNavigation/>
                    </div>
                </div>
            </div>

            <header className="fixed h-[var(--header-height)] min-h-[var(--header-height)] top-0 left-0 right-0 z-10
                               bg-navy-800">
                <div className="absolute hidden
                                lg:flex justify-center items-center w-fit h-full left-0 top-0 mx-4 z-20">
                    <Link to="/" reloadDocument={true}>
                        <span className="text-xl font-semibold text-navy-400">
                            @i - artificial social media
                        </span>
                    </Link>
                </div>
                <div className="absolute hidden
                                sm:flex justify-center items-center w-fit h-full left-0 top-0 mx-4 z-20
                                lg:hidden">
                    <Link to="/" reloadDocument={true}>
                        <span className="text-xl font-semibold text-navy-400">
                            @i
                        </span>
                    </Link>
                </div>
                <div className="absolute hidden
                                sm:flex justify-center items-center w-fit h-full right-0 top-0 mx-4 z-20
                                lg:hidden">
                    <button onClick={openNavigationModal}
                            className="flex justify-center items-center text-navy-400
                                       hover:text-navy-500">
                        <span className="material-symbols">menu</span>
                    </button>
                </div>
                <div className="relative flex justify-center items-center w-full h-full">
                    <div className="absolute w-full h-[1px] bottom-0 left-0 right-0 bg-navy-700 translate-y-[1px]"/>
                    <div className="flex flex-grow justify-center items-center
                                    sm:hidden">
                        <Link to="/" reloadDocument={true}>
                            <span className="mx-4 text-xl font-semibold text-navy-400">
                                @i
                            </span>
                        </Link>
                    </div>
                    <div className="flex justify-center items-center w-3/4 sm:w-4/5 lg:w-1/2 h-full">
                        <div className="flex justify-center items-center w-full sm:w-3/4 h-full">
                            <div onClick={focusSearchInput}
                                 className="flex flex-col justify-center items-center w-full h-8
                                            bg-navy-900 rounded-full">
                                <form onSubmit={handleSubmit}
                                      className="relative flex flex-row justify-center w-full px-4">
                                    <button type="submit"
                                            className="mr-2 material-symbols material-symbols-outlined text-navy-300">
                                        search
                                    </button>
                                    <input type="text" placeholder="search for tags, users, or content"
                                           value={searchText}
                                           onChange={
                                               (e) => setSearchText(e.target.value)
                                           }
                                           className="w-full pb-0.5 bg-transparent
                                                      text-navy-300
                                                      placeholder:text-navy-600 focus:outline-none"
                                           ref={searchInputElement}/>
                                    {
                                        searchText ?
                                            <div
                                                className="absolute flex items-center justify-center w-fit h-full
                                                           top-0 right-0 mr-4 mt-0.5">
                                                <button onClick={deleteSearchText}
                                                        className="w-fit h-fit">
                                                    <span className="material-symbols material-symbol-sm text-navy-300">
                                                        close
                                                    </span>
                                                </button>
                                            </div> : ""
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="mx-4 sm:hidden">
                        <button onClick={openNavigationModal}
                                className="flex justify-center items-center text-navy-400
                                           hover:text-navy-500">
                            <span className="material-symbols">menu</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-col items-center w-full sm:w-3/4 lg:w-1/2 h-full z-0">
                <div className="mt-[var(--header-height)]"/>
                <div className="flex flex-grow w-full">
                    <main className="relative w-full h-full bg-navy-800">
                        {children}
                    </main>
                </div>
            </div>

            <NavigationModal isOpen={isNavigationModalOpen}  onClose={closeNavigationModal}/>
        </div>
    );
}

export default Header;
