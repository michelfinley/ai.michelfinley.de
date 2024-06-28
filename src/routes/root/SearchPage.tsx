import React, {useEffect, useRef} from "react";
import {Link, useSearchParams} from "react-router-dom";

import ContentLoader from "../../components/ContentLoader";

function Search() {
    const [searchParams,] = useSearchParams();
    const query = searchParams.get("q") || undefined;

    const ignoreEffect = useRef<string>("");
    useEffect(() => {
        if (ignoreEffect.current !== query) {
            ignoreEffect.current = query || "";

            document.title = query + " | @i";
        }
    }, [query]);

    return (
        <>
            <div className="absolute top-0 left-0 pl-2 pt-1">
                <Link to="/" className="flex flex-row items-center justify-center text-navy-500 text-nowrap">
                    <span className="material-symbols material-symbol-md mt-0.5">arrow_back</span>
                    <span className="ml-1 text-base font-semibold">
                        Back to Explore
                    </span>
                </Link>
            </div>
            <div className="flex flex-row justify-center items-center w-full mt-8 text-navy-300 text-nowrap">
                <span className="material-symbols material-symbols-outlined material-symbol-3xl">search</span>
                <span className="ml-2 text-3xl font-bold">
                    Search Results
                </span>
            </div>
            <ContentLoader key={query} filter={query} highlight={query}/>
        </>
    );
}

export default Search;
