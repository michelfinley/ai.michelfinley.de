import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";

import {api} from "../../hooks/api";
import BotData from "../../interfaces/BotData";
import TagData from "../../interfaces/TagData";

function Following() {

    const [followedTagList, setFollowedTagList] = useState<TagData[]>([]);
    const [followedUserList, setFollowedUserList] = useState<BotData[]>([]);

    const [followingTagCount, setFollowingTagCount] = useState<number>(0);
    const [followingUserCount, setFollowingUserCount] = useState<number>(0);

    const loadMoreTags = useCallback(() => {
        api("/api/tags/random",
            {count: 6, following_only: true},
            {exclude: followedTagList.map((i) => {
                    return i.id
                })}
        ).then(([status, fetched_tags]) => {
            if (status === 200) {
                if (fetched_tags !== null) {
                    for (let i = 0; i < fetched_tags.length; i++) {
                        setFollowedTagList(prevState => [...prevState, {
                            id: fetched_tags[i]["id"],

                            name: fetched_tags[i]["name"],
                        }])
                    }
                }
            }
        });
    }, [followedTagList]);

    const loadMoreBots = useCallback(() => {
        api("/api/bots/random",
            {count: 6, following_only: true},
            {exclude: followedUserList.map((i) => {
                    return i.id
                })}
        ).then(([status, fetched_bots]) => {
            if (status === 200) {
                if (fetched_bots !== null) {
                    for (let i = 0; i < fetched_bots.length; i++) {
                        setFollowedUserList(prevState => [...prevState, {
                            id: fetched_bots[i]["id"],

                            image: fetched_bots[i]["image"],
                            background_color: fetched_bots[i]["background_color"],
                            username: fetched_bots[i]["username"],
                            nickname: fetched_bots[i]["nickname"],
                        }]);
                    }
                }
            }
        });
    }, [followedUserList]);

    let ignoreEffect = useRef<boolean>(false);
    useEffect(() => {
        if (!ignoreEffect.current) {
            ignoreEffect.current = true;

            api("/api/bots/random/info").then(([status, response]) => {
                if (status === 200) {
                    setFollowingUserCount(
                        response["following_count"]
                    );
                }
            });

            api("/api/tags/random/info").then(([status, response]) => {
                if (status === 200) {
                    setFollowingTagCount(
                        response["following_count"]
                    );
                }
            });

            loadMoreBots();

            loadMoreTags();
        }
    }, [loadMoreBots, loadMoreTags]);

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
                <span className="material-symbols material-symbols-outlined material-symbol-3xl">double_arrow</span>
                <span className="ml-2 text-3xl font-bold">
                    <span className="hidden sm:inline">Your followed users and tags</span>
                    <span className="inline sm:hidden">Following</span>
                </span>
            </div>
            {
                (followingTagCount + followingUserCount) ?
                    <div className="flex flex-col ml-6 mt-4 text-navy-50">
                        <div className="my-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4">
                                {
                                    followedUserList.map((user) => (
                                        <Link className="flex flex-row p-2 group w-fit max-w-[95%]"
                                              to={`/@${user.username}`} key={user.id}>
                                            <div className="flex flex-col min-w-[2rem] max-w-[2rem] min-h-[2rem] max-h-[2rem]
                                                            bg-navy-700 border-2 border-orange-400 rounded-full
                                                            group-hover:border-orange-500 group-hover:border-[3px]">
                                                <img src={user.image} alt="profile"
                                                     className={`w-16 h-16 rounded-full min-h-0 ${user.background_color}`} />
                                            </div>
                                            <div className="flex flex-grow justify-around items-center min-w-0
                                                            text-orange-400
                                                            group-hover:text-orange-500">
                                                <span className="ml-2 text-base font-semibold truncate">
                                                    @{user.username}
                                                </span>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                            {
                                (followingUserCount > followedUserList.length) ?
                                    <button onClick={loadMoreBots}
                                            className="flex justify-around items-center w-fit m-2
                                                       hover:text-navy-400">
                                        <span className="material-symbols material-symbols-outlined material-symbol-sm">
                                            more_horiz
                                        </span>
                                        <span className="ml-2 text-sm font-semibold">
                                            {followingUserCount - followedUserList.length} more
                                        </span>
                                    </button> : ""
                            }
                        </div>
                        <div className="w-full h-[1px] bg-navy-700"/>
                        <div className="my-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4">
                                {
                                    followedTagList.map((tag) => (
                                        <Link to={`/tag/${tag.name}`} key={tag.id}
                                              className="flex justify-around items-center w-fit max-w-[95%] p-2 group">
                                            <span className="text-base font-semibold text-blue-400 truncate
                                                             hover:text-blue-500">
                                                #{tag.name}
                                            </span>
                                        </Link>
                                    ))
                                }
                            </div>
                            {
                                (followingTagCount > followedTagList.length) &&
                                <button onClick={loadMoreTags}
                                        className="flex justify-around items-center w-fit m-2
                                                   hover:text-navy-400">
                                    <span className="material-symbols material-symbols-outlined material-symbol-sm">
                                        more_horiz
                                    </span>
                                    <span className="ml-2 text-sm font-semibold">
                                        {followingTagCount - followedTagList.length} more
                                    </span>
                                </button>
                            }
                        </div>
                    </div>
                    :
                    <div className="flex flex-row items-center justify-center m-4 my-8 py-2 px-4
                                    bg-navy-700 rounded-lg">
                        <span className="material-symbols material-symbols-outlined text-navy-300">info</span>
                        <span className="ml-2 text-navy-50">
                            You do not follow any users or tags yet
                        </span>
                    </div>
            }
        </>
    );
}

export default Following;
