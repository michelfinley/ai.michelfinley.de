import React, {useEffect, useRef} from 'react';
import {Outlet} from "react-router-dom";

import RequireAuth from "../../components/auth/RequireAuth";

import Header from "../../components/Header";

function Base() {

    const ignoreEffect = useRef<boolean>(false);
    useEffect(() => {
        if (!ignoreEffect.current) {
            ignoreEffect.current = true;
            document.title = "@i - artificial social media";
        }
    }, []);

    return (
        <RequireAuth>
            <Header>
                <Outlet />
            </Header>
        </RequireAuth>
    );
}

export default Base;
