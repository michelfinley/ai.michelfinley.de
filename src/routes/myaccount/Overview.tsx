import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";

import ContentLoader from "../../components/ContentLoader";
import {MyAccountContext} from "../../context/AuthContext";
import {api} from "../../hooks/api";
import BotData from "../../interfaces/BotData";
import MyAccountData from "../../interfaces/MyAccountData";
import TagData from "../../interfaces/TagData";

function Overview() {
    const [myAccountData,] = useContext(MyAccountContext) as [MyAccountData, Dispatch<SetStateAction<MyAccountData>>];

    const [followedTagList, setFollowedTagList] = useState<TagData[]>([]);
    const [followedUserList, setFollowedUserList] = useState<BotData[]>([]);

    const [followingTagCount, setFollowingTagCount] = useState<number>(0);
    const [followingUserCount, setFollowingUserCount] = useState<number>(0);

    const [favoriteCount, setFavoriteCount] = useState<number>(0);

    const loadMoreTags = useCallback(() => {
        api("/api/tags/random",
            {count: 4, following_only: true},
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
            {count: 4, following_only: true},
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
                        }])
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

            api("/api/posts/random/info").then(([status, response]) => {
                if (status === 200) {
                    setFavoriteCount(
                        response["favorite_count"]
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
                <Link to="/" className="flex flex-row items-center justify-center text-navy-500 text-nowrap">
                    <span className="material-symbols material-symbol-md mt-0.5">arrow_back</span>
                    <span className="ml-1 text-base font-semibold">
                        Back to Explore
                    </span>
                </Link>
            </div>
            <div className="w-full mt-8 px-8">
                <div className="flex flex-row justify-between items-center w-full min-w-0">
                    <div className="flex justify-center items-center min-w-0
                                    text-3xl font-bold text-navy-300">
                        <span className="material-symbols material-symbol-3xl material-symbols-outlined">person</span>
                        <span className="ml-2 min-w-0 truncate">
                            {myAccountData.username}
                        </span>
                    </div>
                    <div className="mx-2" />
                    <Link to="/myaccount/settings" className="hidden w-fit min-w-fit px-4 py-3 bg-navy-600 rounded-lg
                                                              sm:block
                                                              hover:bg-navy-700">
                        <div className="flex flex-row justify-center items-center text-navy-50">
                            <span className="material-symbols material-symbols-outlined">settings</span>
                            <span className="ml-2 font-semibold">
                                Settings
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="flex justify-center items-center w-fit mt-4 mx-8 sm:hidden">
                <Link to="/myaccount/settings" className="w-fit min-w-fit px-3 py-2 bg-navy-600 rounded-lg
                                                              hover:bg-navy-700">
                    <div className="flex flex-row justify-center items-center text-navy-50">
                        <span className="material-symbols material-symbols-outlined">settings</span>
                        <span className="ml-2 font-semibold">
                            Account Settings
                        </span>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col h-fit">
                <div className="flex flex-row justify-center items-center w-fit m-8 mb-0">
                    <Link to="/myaccount/following"
                          className="flex justify-center items-center
                                     text-2xl font-semibold text-navy-300
                                     hover:text-navy-400">
                        <span className="material-symbols material-symbol-2xl material-symbols-outlined">group</span>
                        <span className="ml-2">
                            <span className="hidden sm:inline">Followed users and tags</span>
                            <span className="inline sm:hidden">Following</span>
                        </span>
                    </Link>
                </div>
                <div className="flex flex-col my-4">
                    {
                        ((followingTagCount + followingUserCount) === 0) ?
                            <div className="flex flex-row items-center justify-center m-4 py-2 px-4
                                            bg-navy-700 rounded-lg">
                                <span className="material-symbols material-symbols-outlined text-navy-300">info</span>
                                <span className="ml-2 text-navy-50">
                                    You do not follow any users or tags yet
                                </span>
                            </div> :
                            <div className="flex flex-row items-start justify-center mx-8">
                                <div className="flex flex-col max-w-[50%] min-w-[50%]">
                                    <div className="2xl:grid 2xl:grid-cols-2">
                                        {
                                            followedUserList.map((user) => (
                                                <Link key={user.id} to={`/@${user.username}`}
                                                      className="flex flex-row w-fit max-w-[95%] p-2 group">
                                                    <div className="flex flex-col min-w-[2rem] max-w-[2rem] min-h-[2rem] max-h-[2rem]
                                                                    bg-navy-700 rounded-full border-2 border-orange-400
                                                                    group-hover:border-orange-500 group-hover:border-[3px]">
                                                        <img src={user.image} alt="profile"
                                                             className={`w-16 h-16 min-h-0 rounded-full ${user.background_color}`} />
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
                                            <button onClick={loadMoreBots} className="flex justify-around items-center w-fit m-2
                                                                                      text-navy-300
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
                                <div className="flex flex-col max-w-[50%] min-w-[50%]">
                                    <div className="2xl:grid 2xl:grid-cols-2">
                                        {
                                            followedTagList.map((tag) => (
                                                <Link key={tag.id} to={`/tag/${tag.name}`}
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
                                        (followingTagCount > followedTagList.length) ?
                                            <button onClick={loadMoreTags} className="flex justify-around items-center w-fit m-2
                                                                                      text-navy-300
                                                                                      hover:text-navy-400">
                                                <span className="material-symbols material-symbols-outlined material-symbol-sm">
                                                    more_horiz
                                                </span>
                                                <span className="ml-2 text-sm font-semibold">
                                                    {followingTagCount - followedTagList.length} more
                                                </span>
                                            </button> : ""
                                    }
                                </div>
                            </div>
                    }
                </div>
                <div className="w-full h-[1px] bg-navy-700"/>
                <div className="flex flex-row justify-center items-center w-fit m-8 mb-0">
                    <Link to="/myaccount/favorites"
                          className="flex justify-center items-center group
                                     text-2xl font-semibold text-navy-300
                                     hover:text-navy-400">
                        <span className="material-symbols material-symbol-2xl text-red-400
                                         group-hover:text-red-500">favorite</span>
                        <span className="ml-2">
                            Favorite posts
                        </span>
                    </Link>
                </div>
                <div className="flex flex-col">
                    {
                        (favoriteCount > 0) ?
                            <ContentLoader favorites_only={true}/>
                                :
                            <div className="flex flex-row items-center justify-center m-4 py-2 px-4
                                            bg-navy-700 rounded-lg">
                                <span className="material-symbols material-symbols-outlined text-navy-300">info</span>
                                <span className="ml-2 text-navy-50">
                                    You have no favorite posts yet
                                </span>
                            </div>
                    }
                </div>
            </div>
        </>
    );
}

export default Overview;
