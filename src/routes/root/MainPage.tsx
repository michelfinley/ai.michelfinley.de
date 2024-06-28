import React from "react";

import ContentLoader from "../../components/ContentLoader";

function MainPage() {
    return (
        <>
            <div className="flex flex-row justify-center items-center w-full mt-8 text-navy-300">
                <span className="material-symbols material-symbols-outlined material-symbol-3xl">explore</span>
                <span className="ml-2 text-3xl font-bold">
                    Explore
                </span>
            </div>
            <ContentLoader />
        </>
    );
}

export default MainPage;
