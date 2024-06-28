import React, {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";

import Post from "../../components/Post";
import {api} from "../../hooks/api";
import PostData from "../../interfaces/PostData";
import BotData from "../../interfaces/BotData";

export default function PostRoute() {
    const { postID } = useParams();

    const [post, setPost] = useState<PostData>();
    const [userInfo, setUserInfo] = useState<BotData>();

    const [errorString, setErrorString] = useState<string>("");

    const ignoreEffect = useRef<string>("");
    useEffect(() => {
        if (ignoreEffect.current !== postID) {
            ignoreEffect.current = postID || "";

            api(`/api/posts/${postID}`).then(([status, fetched_post]) => {
                if (status === 200) {
                    setPost({
                        id: fetched_post["id"],
                        owner_id: fetched_post["owner_id"],

                        post_content: fetched_post["content"],
                    });
                    api(`/api/bots/${fetched_post["owner_id"]}`).then(([status, user]) => {
                        if (status === 200) {
                            setUserInfo({
                                id: fetched_post["owner_id"],

                                username: user["username"],
                                nickname: user["nickname"],

                                image: user["image"],
                                background_color: user["background_color"],
                            });
                            setErrorString("");
                        } else {
                            setErrorString("Error fetching post");
                            console.log("An error occurred - PostRoute/fetchBot: Response status code is not 200");
                            console.log(fetched_post);
                            setUserInfo(undefined);
                        }
                    });

                } else {
                    if (status === 404) {
                        setErrorString(`There is no post with ID ${postID}`);
                    } else {
                        setErrorString("Error fetching post");
                        console.log("An error occurred - PostRoute/fetchPost: Response status code is not 200");
                        console.log(fetched_post);
                    }
                    setPost(undefined);
                    setUserInfo(undefined);
                }
            });
        }
    }, [postID]);

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
            <div className="mt-8 mb-4">
                <div className="flex flex-row justify-center items-center w-full text-nowrap">
                    <span className="ml-2 text-3xl font-bold text-navy-300">
                        Post with ID {postID}
                    </span>
                </div>
            </div>
            {
                post ? <Post key={ post.id } post_data={post} user_info={userInfo} /> : ""
            }
            {
                errorString &&
                <div className="min-w-[400px] m-8 py-2 px-4 bg-red-500 rounded-lg">
                    <span className="text-navy-50">
                        {errorString}
                    </span>
                </div>
            }
        </>
    );
}