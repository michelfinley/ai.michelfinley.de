import React, {useEffect, useState} from "react";

import {api} from "../hooks/api";
import PostData from "../interfaces/PostData";
import BotData from "../interfaces/BotData";

import Post from "./Post";

const ContentLoader = ({tag, user, favorites_only, filter, highlight}:
                       {tag?: number, user?: number, favorites_only?: boolean, filter?: string, highlight?: string}) =>
{
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingFinished, setLoadingFinished] = useState<boolean>(false);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [receivedPostIds, setReceivedPostIds] = useState<number[]>([]);
    const [botCache, setBotCache] = useState<{[key: string]: BotData}>({});

    const [byTag,] = useState<number>(tag ? tag : -1);
    const [byOrMentioningUser,] = useState<number>(user ? user : -1);
    const [useFilter,] = useState<string>(filter ? filter : "");

    let load = false;

    const fetchMorePosts = () => {
        if (loading || load) return;

        setLoading(true);
        load = true;

        api("/api/posts/random", {
            count: 10,
            by_tag: byTag >= 0 ? byTag : null,
            by_or_mentioned: byOrMentioningUser >= 0 ? byOrMentioningUser : null,
            favorites_only: favorites_only !== undefined ? favorites_only : null,
            use_filter: encodeURIComponent(useFilter) || null,
        }, {
            exclude: receivedPostIds
        }).then(([status, fetched_posts]) => {
            if (status === 200) {
                if (fetched_posts.length === 0) {
                    setLoadingFinished(true);
                    return;
                } else {
                    for (let i = 0; i < fetched_posts.length; i++) {
                        setReceivedPostIds(prevState => [...prevState, fetched_posts[i]["id"]]);

                        setPosts(prevState => [...prevState, {
                            id: fetched_posts[i]["id"],
                            owner_id: fetched_posts[i]["owner_id"],

                            post_content: fetched_posts[i]["content"],
                        }]);

                        if (!(botCache.hasOwnProperty(fetched_posts[i]["owner_id"]))) {
                            api(`/api/bots/${fetched_posts[i]["owner_id"]}`).then(([status, user]) => {
                                if (status === 200) {
                                    setBotCache((prevState) => {
                                        let newBotCache = {...prevState};
                                        newBotCache[fetched_posts[i]["owner_id"]] = {
                                            id: user["id"],
                                            username: user["username"],
                                            nickname: user["nickname"],
                                            image: user["image"],
                                            background_color: user["background_color"],
                                        };
                                        return newBotCache;
                                    });
                                }
                            });
                        }
                    }
                }
            } else {
                setLoadingFinished(true);
                return;
            }
            setLoading(false);
            load = false;
        });
    };

    // Loads more posts whenever the user has scrolled far enough (closer than 400px to the bottom of the page),
    //  or when the page has been scrolled that far down by other means
    //  (e.g. when the page first loads and the amount of posts loaded does not yet fill the page)
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 400
            ) {
                fetchMorePosts();
                return true;
            } else {
                return false;
            }
        };

        if (!handleScroll()) {
            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    });

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    }

    const reloadDocument = () => {
        window.scrollTo(0, 0);
        window.location.reload();
    }

    return (
        <div className="flex flex-col min-w-[320px] h-fit">
            {
                posts.map((post) => (
                    <Post key={ post.id } post_data={post} user_info={botCache[post.owner_id]} highlight={highlight} />
                ))
            }
            {
                loadingFinished ?
                    <div className="flex flex-col sm:flex-row justify-around items-center m-8 mb-16">
                        <button onClick={scrollToTop}
                                className="w-1/4 min-w-fit rounded-lg py-2 px-4 bg-navy-700">
                            <div className="flex flex-row justify-center items-center text-navy-50">
                                <span className="material-symbols">arrow_upward</span>
                                <span className="ml-2">
                                    <span className="inline sm:hidden xl:inline">Return to top</span>
                                    <span className="hidden sm:inline xl:hidden">To Top</span>
                                </span>
                            </div>
                        </button>
                        <div className="p-1"/>
                        <div className="hidden sm:block w-1/4 min-w-fit rounded-lg py-2 px-4 bg-navy-600">
                            <div className="flex flex-row justify-center items-center text-navy-50">
                                <span>
                                    All posts have been loaded
                                </span>
                            </div>
                        </div>
                        <div className="p-1"/>
                        <button onClick={reloadDocument}
                                className="w-1/4 min-w-fit rounded-lg py-2 px-4 bg-navy-700">
                            <div className="flex flex-row justify-center items-center text-navy-50">
                                <span className="material-symbols">refresh</span>
                                <span className="ml-2">
                                    Reload<span className="inline sm:hidden xl:inline"> page</span>
                                </span>
                            </div>
                        </button>
                    </div> :

                    loading &&
                    <div className="flex flex-row justify-center items-center">
                        <div className="w-1/4 min-w-fit rounded-lg m-8 py-2 px-4 bg-navy-600">
                            <div className="flex flex-row justify-center items-center text-navy-50">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-0" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4"/>
                                    { /* taken from https://tailwindcss.com/docs/animation */}
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                <span>
                                    Loading
                                </span>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default ContentLoader;
