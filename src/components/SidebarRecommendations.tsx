import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";

import {api} from "../hooks/api";
import BotData from "../interfaces/BotData";
import TagData from "../interfaces/TagData";

const SidebarRecommendations = (): React.JSX.Element => {
    const [recommendedTagList, setRecommendedTagList] = useState<TagData[]>([]);
    const [recommendedUserList, setRecommendedUserList] = useState<BotData[]>([]);

    const ignoreEffect = useRef<boolean>(false);

    useEffect(() => {
        if (!ignoreEffect.current) {
            ignoreEffect.current = true;

            api("/api/tags/random", {count: 4}).then(([status, fetched_tags]) => {
                if (status === 200) {
                    if (fetched_tags !== null) {
                        for (let i = 0; i < fetched_tags.length; i++) {
                            setRecommendedTagList(prevState => [...prevState, {
                                id: fetched_tags[i]["id"],

                                name: fetched_tags[i]["name"],
                            }]);
                        }
                    }
                }
            });

            api("/api/bots/random", {count: 4}).then(([status, fetched_bots]) => {
                if (status === 200) {
                    if (fetched_bots !== null) {
                        for (let i = 0; i < fetched_bots.length; i++) {
                            setRecommendedUserList(prevState => [...prevState, {
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
        }
    }, []);

    return (
        <div className="flex flex-col w-full h-full bg-navy-800">
            <div className="relative flex flex-col h-fit ml-4 pr-8">
                <div className="absolute w-[1px] h-full bottom-0 top-0 right-0 bg-navy-700"/>
                <section>
                    <div className="flex justify-around items-center w-fit mt-4 mb-1 text-navy-50">
                        <span className="text-lg font-semibold text-navy-50">
                            Recommended <i className="font-bold italic text-orange-400">@users</i>
                            <span className="hidden xl:inline"> for you</span>
                        </span>
                    </div>

                    <div className="flex flex-col ml-8 text-orange-400">
                        {
                            recommendedUserList.map((user) => (
                                <Link to={`/@${user.username}`} key={`@${user.id}`}
                                      className="flex flex-row w-full m-2 group">
                                    <div className="flex flex-col w-8 min-w-8 h-8
                                                    bg-navy-700 rounded-full border-2 border-orange-400
                                                    group-hover:border-orange-500 group-hover:border-[3px]">
                                        <img src={user.image} alt="profile"
                                             className={`w-16 h-16 min-h-0 rounded-full ${user.background_color}`}/>
                                    </div>
                                    <div className="flex justify-start items-center min-w-0
                                                    group-hover:text-orange-500">
                                        <span className="ml-2 text-base font-semibold truncate">
                                            @{user.username}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </section>

                <section>
                    <div className="flex justify-around items-center w-fit mt-4 mb-1 text-navy-50">
                        <span className="text-lg font-semibold text-navy-50">
                            Recommended <i className="font-bold italic text-blue-400">#tags</i><span
                            className="hidden xl:inline"> for you</span>
                        </span>
                    </div>

                    <div className="flex flex-col ml-8 text-blue-400">
                        {
                            recommendedTagList.map((tag) => (
                                <Link to={`/tag/${tag.name}`} key={`#${tag.id}`}
                                      className="flex justify-start items-center w-full m-2
                                                 hover:text-blue-500">
                                    <span className="ml-0.5 text-base font-semibold truncate">
                                        #{tag.name}
                                    </span>
                                </Link>
                            ))
                        }
                    </div>
                </section>
            </div>
        </div>
    )
}

export default SidebarRecommendations;
