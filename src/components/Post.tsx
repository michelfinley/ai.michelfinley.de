import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";

import {NotificationContext} from "../context/NotificationContext";
import {api} from "../hooks/api";
import BotData from "../interfaces/BotData";
import NotificationData from "../interfaces/NotificationData";
import PostData from "../interfaces/PostData";
import PostInfoData from "../interfaces/PostInfoData";

import logo from "../res/icon64.png";

function escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const Post = ({ post_data, user_info, highlight }: { post_data: PostData, user_info: BotData | undefined, highlight?: string }) => {

    const [postInfoData, setPostInfoData] = useState<PostInfoData>()

    const setNotification = useContext(NotificationContext) as Dispatch<SetStateAction<NotificationData | null>>;

    useEffect(() => {
        api(`/api/posts/${post_data.id}/info`).then(([status, postInfo]) => {
            if (status === 200) {
                setPostInfoData({
                    id: postInfo["id"],

                    favorite: postInfo["favorite"],

                    favorite_count: postInfo["favorite_count"],
                });
            } else {
                console.log(postInfo);
                setPostInfoData(undefined);
            }
        });
    }, [post_data]);

    let highlightSplit = [""];
    let escapedHighlightSplit = [""];

    if (highlight) {
        highlight = highlight.toLowerCase();
        highlightSplit = highlight.split(" ");
        escapedHighlightSplit = escapeRegex(highlight).split(" ");
    }

    const post_content = post_data.post_content.split(/([#@]\w+)/g).map((text, id) => ({
        id,
        href: text.startsWith("@") ? `/@${text.substring(1)}` :
            text.startsWith("#") ? `/tag/${text.substring(1).toLowerCase()}`  : undefined,
        text
    })).map(({ id, href, text }) => {
        if (href) {
            return <Link key={id} to={href}
                         className={text.startsWith("#") ? "text-blue-400 hover:underline"  :
                             text.startsWith("@") ? "text-orange-400 hover:text-orange-500" : ""}>{
                highlight ?
                    text.split(
                            new RegExp(
                                `(${escapedHighlightSplit
                                    .filter(word => word)
                                    .join("|")})`, "i")
                        ).map((t, ix) => {
                        if (highlightSplit.indexOf(t.toLowerCase()) >= 0) {
                            return <span key={ix} className="bg-navy-800">{t}</span>
                        } else {
                            return <span key={ix}>{t}</span>
                        }
                    }) : text
            }</Link>
        } else {
            if (highlight) {
                return <span key={id}>
                    {
                        text.split(
                                new RegExp(
                                    `(${escapedHighlightSplit
                                    .filter(word => word)
                                    .join("|")})`, "i")
                            ).map((t, ix) => {
                                if (highlightSplit.indexOf(t.toLowerCase()) >= 0) {
                                    return <span key={ix} className="bg-navy-800">{t}</span>
                                } else {
                                    return <span key={ix}>{t}</span>
                                }
                            })
                    }
                </span>
            } else {
                return <span key={id}>{text}</span>
            }
        }
    })

    const [favoriteAnimationPlaying, setFavoriteAnimationPlaying] = useState<boolean>(false);

    const onFavorite = () => {
        if (postInfoData) {
            api(`/api/posts/${post_data.id}/${postInfoData.favorite ? "unfavorite" : "favorite"}`,
                {}, {method: "POST"}).then(([status, postInfo]) => {
                if (status === 200) {
                    setPostInfoData({
                        id: postInfo["id"],

                        favorite: postInfo["favorite"],

                        favorite_count: postInfo["favorite_count"],
                    });
                    if (postInfo["favorite"]) {
                        setFavoriteAnimationPlaying(true);
                        setTimeout(function() {
                            setFavoriteAnimationPlaying(false);
                        }, 1000);
                    } else {
                        setFavoriteAnimationPlaying(false);
                    }
                } else {
                    console.log(postInfo);
                }
            });
        }
    }

    const onCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`${window.location.origin}/post/${post_data.id}`).then(() => {
                setNotification({
                    color: "bg-blue-500 text-navy-50",
                    text: "Copied to clipboard",
                });
            });
        } else {
            setNotification({
                color: "bg-red-500 text-navy-50",
                text: "Couldn't copy to clipboard",
            });
        }
    }

    return (
        <article className="m-8">
            <div className="bg-navy-700 rounded-lg">
                <div className="relative flex flex-row p-4 pb-0">
                    <div className="w-fit pr-4">
                        {
                            user_info ?
                                <Link to={`/@${user_info.username}`}
                                      className="flex flex-col w-12 h-12 z-10
                                                 rounded-full border-2 border-orange-500">
                                    <img src={user_info.image} alt="profile"
                                         className={`w-24 h-24 min-h-0 rounded-full ${user_info.background_color}`}/>
                                </Link>
                                :
                                <div className="flex flex-col w-12 h-12 z-10
                                                bg-logo rounded-full border-2 border-orange-500">
                                    <img src={logo} alt="profile"
                                         className="min-h-0 scale-75 rounded-full"/>
                                </div>
                        }
                    </div>
                    <div className="flex flex-col min-w-0 break-words">
                        <div className="flex flex-col">
                            {
                                user_info ?
                                    <Link to={`/@${user_info.username}`}
                                          className="text-lg font-semibold text-orange-400 min-w-0 truncate
                                                     hover:text-orange-500">
                                        <span className="">@{user_info.username}</span>
                                    </Link>
                                    :
                                    <div className="w-fit">
                                        <span className="text-lg font-semibold text-orange-400">
                                            unknown user
                                        </span>
                                    </div>
                            }
                            <div className="mt-1">
                                <span className="text-navy-50">
                                    {post_content}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-center items-center h-12 w-20">
                            <div className="flex justify-between items-center w-20">
                                <button onClick={onFavorite}
                                        className={`post-reaction-button relative group`}>
                                    {
                                        favoriteAnimationPlaying ?
                                            <span className="material-symbols material-is-favorite-icon
                                                             absolute top-0 left-0 right-0 bottom-0
                                                             animate-favorite-heart-pulse">
                                                    favorite
                                                </span> : ""
                                    }
                                    <span className={`material-symbols relative ${
                                        postInfoData?.favorite ? "material-is-favorite-icon" : "material-not-favorite-icon"
                                    }`}>
                                        favorite
                                    </span>
                                    {
                                        postInfoData?.favorite_count ?
                                            <span className={`absolute left-0 top-0 bot-0 ml-7 
                                                              ${postInfoData?.favorite ? "text-red-400" : ""}`}>
                                                {postInfoData?.favorite_count}
                                            </span> : ""
                                    }
                                </button>
                                <button onClick={onCopy}
                                        className="material-symbols post-reaction-button
                                                   hover:text-blue-400">
                                        <span className="material-symbols-outlined">
                                            content_copy
                                        </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Post;
