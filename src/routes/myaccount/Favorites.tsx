import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import ContentLoader from "../../components/ContentLoader";
import {api} from "../../hooks/api";

function Favorites() {
    const [favoriteCount, setFavoriteCount] = useState<number>(0);

    useEffect(() => {
        api("/api/posts/random/info").then(([status, response]) => {
            if (status === 200) {
                setFavoriteCount(
                    response["favorite_count"]
                );
            }
        });
    }, []);

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
            <div className="flex flex-row justify-start sm:justify-center items-center w-full mt-8 px-8">
                <span className="material-symbols material-symbol-3xl text-red-400">favorite</span>
                <span className="ml-2 text-3xl font-bold text-navy-300">
                    <span className="hidden sm:inline">Your favorite posts</span>
                    <span className="inline sm:hidden">Favorites</span>
                </span>
            </div>
            {
                (favoriteCount > 0) ?
                    <ContentLoader favorites_only={true}/>
                    :
                    <div className="flex flex-row items-center justify-center m-4 my-8 py-2 px-4
                                    bg-navy-700 rounded-lg">
                        <span className="material-symbols material-symbols-outlined text-navy-300">info</span>
                        <span className="ml-2 text-navy-50">
                            You have no favorite posts yet
                        </span>
                    </div>
            }
        </>
    );
}

export default Favorites;
