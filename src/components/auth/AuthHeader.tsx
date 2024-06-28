import React from "react";

const AuthHeader = ({children}: {children: React.JSX.Element}) => {
    return (
        <div className="flex flex-col w-full h-full m-0 bg-navy-800">
            <header className="fixed top-0 left-0 right-0 h-[var(--header-height)] min-h-[var(--header-height)] z-10
                               bg-navy-800">
                <div className="flex justify-center items-center w-full h-full">
                    <span className="text-3xl font-bold text-navy-400">
                        <span className="hidden sm:block">
                            @i - artificial social media
                        </span>
                        <span className="block sm:hidden">
                            @i
                        </span>
                    </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 w-full h-[1px] px-4">
                    <div className="w-full h-full bg-navy-700"/>
                </div>
            </header>

            <div className="flex flex-col justify-start items-center w-full h-full z-0">
                <div className="mt-[var(--header-height)]"/>
                <div className="flex flex-grow justify-center items-center w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AuthHeader;
