import React, {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";

import ContentLoader from "../../components/ContentLoader";
import {api} from "../../hooks/api";
import TagData from "../../interfaces/TagData";
import TagInfoData from "../../interfaces/TagInfoData";

function TagRoute() {
    const { tagname } = useParams();

    const [tagID, setTagID] = useState<number>(-1);
    const [tagData, setTagData] = useState<TagData>();
    const [tagInfoData, setTagInfoData] = useState<TagInfoData>();

    const [errorString, setErrorString] = useState<string>("");

    const ignoreEffect = useRef<string>("");
    useEffect(() => {
        if (ignoreEffect.current !== tagname) {
            ignoreEffect.current = tagname || "";

            document.title = tagname + " | @i";

            api(`/api/tags/${tagname}`).then(([status, tag]) => {
                if (status === 200) {
                    setTagID(tag["id"]);

                    setTagData({
                        id: tag["id"],

                        name: tag["name"],
                    });

                    setErrorString("");

                    api(`/api/tags/${tagname}/info`).then(([status, tagInfo]) => {
                        if (status === 200) {
                            setTagInfoData({
                                id: tagInfo["id"],

                                following: tagInfo["following"],

                                post_count: tagInfo["post_count"],
                                follower_count: tagInfo["follower_count"],
                            });
                        } else {
                            console.log("An error occurred - TagRoute/fetchTagInfo: Response status code is not 200");
                            console.log(tagInfo);
                            setTagInfoData(undefined);
                        }
                    });

                } else {
                    if (status === 404) {
                        setErrorString(`There is no post with the tag #${tagname}`);
                    } else {
                        setErrorString(tag.statusText);
                        console.log("An error occurred - TagRoute/fetchTag: Response status code is not 200");
                        console.log(tag);
                    }
                    setTagID(-1);
                    setTagData(undefined);
                    setTagInfoData(undefined);
                }
            });
        }
    }, [tagname]);

    const handleFollow = () => {
        if (tagInfoData) {
            api(`/api/tags/${tagname}/${tagInfoData.following ? "unfollow" : "follow"}`, {}, {method: "POST"}).then(([status, tagInfo]) => {
                if (status === 200) {
                    setTagInfoData({
                        id: tagInfo["id"],

                        following: tagInfo["following"],

                        post_count: tagInfo["post_count"],
                        follower_count: tagInfo["follower_count"],
                    });
                } else {
                    // 409 gets sent when the value stored in tagInfoData.following is incorrect
                    if (status === 409) {
                        setTagInfoData((prevState) => {
                            // Cannot be undefined, since handleFollow is only called after prevState has been confirmed to be set
                            if (prevState) {
                                let newTagInfoData: TagInfoData = {...prevState};
                                newTagInfoData.following = !newTagInfoData.following;
                                newTagInfoData.follower_count += newTagInfoData.following ? 1 : -1;
                                return newTagInfoData;
                            }
                        });
                    } else {
                        console.log(tagInfo);
                    }
                }
            });
        }
    }

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
                <div className="flex flex-col justify-center items-center w-full">
                    <div className="relative flex flex-row items-center w-full h-full px-4 lg:px-16">
                        <div className="flex flex-col items-start w-full min-w-0 h-full mt-2">
                            <div className="flex flex-row justify-between w-full max-w-full h-fit">
                                <span className="min-w-0 text-xl font-bold text-navy-200 truncate
                                                 sm:text-2xl
                                                 xl:text-3xl">
                                    #{tagData ? tagData.name : tagname}
                                </span>
                                <div className="mx-2" />
                                {
                                    tagInfoData ?
                                        tagInfoData.following ?
                                            <button onClick={handleFollow}
                                                    className="w-fit min-w-fit px-3 py-1 bg-red-500 rounded-xl
                                                               text-base font-semibold text-navy-50
                                                               xl:text-lg
                                                               hover:bg-red-600">
                                                Unfollow
                                            </button>
                                            :
                                            <button onClick={handleFollow}
                                                    className="w-fit min-w-fit px-3 py-1 bg-blue-500 rounded-xl
                                                               text-base font-semibold text-navy-50
                                                               xl:text-lg
                                                               hover:bg-blue-600">
                                                Follow
                                            </button>
                                        : ""
                                }
                            </div>
                            <span className="mt-2 text-xs font-base text-navy-400
                                             xl:mt-4">
                                {tagInfoData ? `${tagInfoData.post_count} posts found - ${tagInfoData.follower_count} followers` : "0 posts found"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {
                tagID >= 0 &&
                <ContentLoader key={tagID} tag={tagID}/>
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

export default TagRoute;
