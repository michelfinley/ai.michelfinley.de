import React, {createContext, useRef, useState} from "react";

import NotificationData from "../interfaces/NotificationData";

export const NotificationContext: React.Context<{}> = createContext({});

export const NotificationProvider = (props: any) => {
    const [notificationData, setNotificationData] = useState<NotificationData>({
        color: "bg-navy-800",
        text: ""
    });
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // very helpful: https://stackoverflow.com/a/45036752
    const resetAnimation = () => {
        const element = document.getElementById("notification");
        if (element) {
            element.style.animation = "none";
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            element.offsetHeight;  // triggers reflow (https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
            element.style.animation = "";
        }
    };

    const setNotification = (notification: NotificationData) => {
        clearTimeout(timeoutRef.current);

        resetAnimation();
        setNotificationData(notification);
        setIsVisible(true);

        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 2900);
    };

    return (
        <NotificationContext.Provider value={setNotification}>
            {props.children}
            {
                isVisible &&
                <div className="fixed flex justify-center items-center bottom-0 left-0 right-0">
                    <div id="notification"
                         className={`flex justify-center items-center w-fit h-fit p-3 mb-8 rounded-xl ${notificationData.color}
                                     notification`}>
                        <span className="text-base font-medium">
                            {notificationData.text}
                        </span>
                    </div>
                </div>
            }
        </NotificationContext.Provider>
    )
};
