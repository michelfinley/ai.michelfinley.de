import {Dispatch, SetStateAction, useContext} from "react";

import {AuthContext} from "../context/AuthContext";
import {NotificationContext} from "../context/NotificationContext";
import NotificationData from "../interfaces/NotificationData";

import {getCookie} from "./cookies";

export interface APIArgs {
    exclude?: number[]
    method?: string
    headers?: Headers
    body?: string
}

export async function api(url: string, params?: Object, args?: APIArgs): Promise<[number, any]> {
    let full_url: string = "";

    let url_param_list: string[] = [];

    let requestOptions: RequestInit;

    let result: [number, any];

    const token = getCookie("token");

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null) {
                url_param_list.push(`${key}=${value}`);
            }
        });
    }

    full_url += url + "?" + url_param_list.join("&");

    if (args && args.exclude && args.exclude.length) {
        full_url += "&x=" + args.exclude.join("&x=");
    }

    if (args) {
        if (args.headers) {
            args.headers.set("Authorization", "Bearer " + token);
        } else {
            args.headers = new Headers({
                "Authorization": "Bearer " + token,
            });
        }
        requestOptions = {
            method: args.method,
            headers: args.headers,
            body: args.body,
        };
    } else {
        requestOptions = {
            headers: new Headers({
                "Authorization": "Bearer " + token,
            })
        };
    }

    try {
        result = await fetch(full_url, requestOptions).then(async (response) => {
            try {
                return [response.status, await response.json()];
            } catch {
                return [500, response.statusText];
            }
        });
    } catch (error) {
        result = [500, "fetch error"];
    }

    return result;
}

export function useLogOut() {
    const setNotification = useContext(NotificationContext) as Dispatch<SetStateAction<NotificationData | null>>;

    const [, setToken] = useContext(AuthContext) as [string, Dispatch<SetStateAction<string | null>>];

    return () => {
        setToken(null);

        setNotification({
            color: "bg-red-600 text-navy-50",
            text: "You have been logged out",
        });
    };
}