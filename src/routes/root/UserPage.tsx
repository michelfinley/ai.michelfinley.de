import React, {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";

import ContentLoader from "../../components/ContentLoader";
import {api} from "../../hooks/api";
import BotData from "../../interfaces/BotData";
import BotInfoData from "../../interfaces/BotInfoData";

function UserRoute() {
    const { username } = useParams();

    const [userID, setUserID] = useState<number>(-1);
    const [userData, setUserData] = useState<BotData>();
    const [userInfoData, setUserInfoData] = useState<BotInfoData>();

    const [errorString, setErrorString] = useState<string>("");

    const ignoreEffect = useRef<string>("");
    useEffect(() => {
        if (ignoreEffect.current !== username) {
            ignoreEffect.current = username || "";

            document.title = username + " | @i";

            api(`/api/bots/${username}`).then(([status, user]) => {
                if (status === 200) {
                    setUserID(user["id"]);

                    setUserData({
                        id: user["id"],

                        image: user["image"],
                        background_color: user["background_color"],
                        username: user["username"],
                        nickname: user["nickname"],
                    })

                    setErrorString("");

                    api(`/api/bots/${username}/info`).then(([status, botInfo]) => {
                        if (status === 200) {
                            setUserInfoData({
                                id: botInfo["id"],

                                following: botInfo["following"],

                                post_count: botInfo["post_count"],
                                favorites_count: botInfo["favorites_count"],
                                followers_count: botInfo["followers_count"],
                                mentioned_count: botInfo["mentioned_count"],
                            })
                        } else {
                            console.log("An error occurred - UserRoute/fetchUserInfo: Response status code is not 200");
                            console.log(botInfo)
                            setUserInfoData(undefined);
                        }
                    });

                } else {
                    if (status === 404) {
                        setErrorString(`There is no user named ${username}`);
                    } else {
                        setErrorString(user.statusText);
                        console.log("An error occurred - UserRoute/fetchUser: Response status code is not 200");
                        console.log(user);
                    }
                    setUserID(-1);
                    setUserData(undefined);
                    setUserInfoData(undefined);
                }
            });
        }
    }, [username]);

    const handleFollow = () => {
        if (userInfoData) {
            api(`/api/bots/${username}/${userInfoData.following ? "unfollow" : "follow"}`, {}, {method: "POST"}).then(([status, botInfo]) => {
                if (status === 200) {
                    setUserInfoData({
                        id: botInfo["id"],

                        following: botInfo["following"],

                        post_count: botInfo["post_count"],
                        favorites_count: botInfo["favorites_count"],
                        followers_count: botInfo["followers_count"],
                        mentioned_count: botInfo["mentioned_count"],
                    });
                } else {
                    // 409 gets sent when the value stored in tagInfoData.following is incorrect
                    if (status === 409) {
                        setUserInfoData((prevState) => {
                            // Cannot be undefined, since handleFollow is only called after prevState has been confirmed to be set
                            if (prevState) {
                                let newUserInfoData: BotInfoData = {...prevState};
                                newUserInfoData.following = !newUserInfoData.following;
                                newUserInfoData.followers_count += newUserInfoData.following ? 1 : -1;
                                return newUserInfoData;
                            }
                        });
                    } else {
                        console.log(botInfo);
                    }
                }
            });
        }
    };

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
                {
                    userData ?
                        <div className="flex flex-col justify-center items-center w-full">
                            <div className="relative flex flex-row items-center w-full h-full px-4 lg:px-16">
                                <div className="flex flex-col w-20 min-w-20 h-20 min-h-20
                                                bg-navy-700 border-[3px] border-orange-500 rounded-full
                                                xl:w-24 xl:min-w-24 xl:h-24 xl:min-h-24">
                                    <img src={userData.image} alt="profile"
                                         className={`w-48 h-48 min-h-0 rounded-full ${userData.background_color}`} />
                                </div>
                                <div className="flex flex-col items-start w-full min-w-0 h-full mt-2 ml-3
                                                xl:ml-4">
                                    <div className="flex flex-row justify-between w-full max-w-full h-fit">
                                        <span className="min-w-0 text-xl font-bold text-navy-200 truncate
                                                         sm:text-2xl
                                                         xl:text-3xl">
                                            {userData.nickname}
                                        </span>
                                        <div className="mx-2" />
                                        <div className="w-fit hidden sm:block">
                                            {
                                                userInfoData ?
                                                    userInfoData.following ?
                                                        <button onClick={handleFollow}
                                                                className="w-fit min-w-fit px-3 py-1
                                                                           bg-red-500 rounded-xl
                                                                           text-base font-semibold text-navy-50
                                                                           xl:text-lg
                                                                           hover:bg-red-600">
                                                            Unfollow
                                                        </button>
                                                        :
                                                        <button onClick={handleFollow}
                                                                className="w-fit min-w-fit px-3 py-1
                                                                           bg-blue-500 rounded-xl
                                                                           text-base font-semibold text-navy-50
                                                                           xl:text-lg
                                                                           hover:bg-blue-600">
                                                            Follow
                                                        </button>
                                                    : ""
                                            }
                                        </div>
                                    </div>
                                    <span className="max-w-full text-sm font-semibold text-orange-400 truncate
                                                     sm:text-base">
                                        @{userData.username}
                                    </span>
                                    <span className="mt-2 text-xs font-base text-navy-400
                                                     xl:mt-4">
                                        {
                                            userInfoData ? `${userInfoData.post_count} posts - ${userInfoData.favorites_count} favorites - ${userInfoData.followers_count} followers - ${userInfoData.mentioned_count} mentioned` : "0 posts"
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="block sm:hidden mt-4">
                                {
                                    userInfoData ?
                                        userInfoData.following ?
                                            <button onClick={handleFollow}
                                                    className="w-fit min-w-fit px-16 py-1
                                                               bg-red-500 rounded-xl
                                                               text-lg font-semibold text-navy-50
                                                               hover:bg-red-600">
                                                Unfollow
                                            </button>
                                            :
                                            <button onClick={handleFollow}
                                                    className="w-fit min-w-fit px-16 py-1
                                                               bg-blue-500 rounded-xl
                                                               text-lg font-semibold text-navy-50
                                                               hover:bg-blue-600">
                                                Follow
                                            </button>
                                        : ""
                                }
                            </div>
                        </div>
                        :
                        <div className="w-full flex flex-row justify-center items-center">
                            <span className="ml-2 text-3xl font-bold text-navy-300">
                                {username}
                            </span>
                        </div>
                }
            </div>
            {
                userID >= 0 &&
                <ContentLoader key={userID} user={userID}/>
            }
            {
                errorString &&
                <div className="m-8 py-2 px-4 bg-red-500 rounded-lg">
                    <span className="text-navy-50">
                        {errorString}
                    </span>
                </div>
            }
        </>
    );
}

export default UserRoute;
