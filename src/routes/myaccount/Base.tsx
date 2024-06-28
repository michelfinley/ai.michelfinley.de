import React, {useEffect, useRef} from 'react';
import {Outlet} from "react-router-dom";

function Base() {

    const ignoreEffect = useRef<boolean>(false);
    useEffect(() => {
        if (!ignoreEffect.current) {
            ignoreEffect.current = true;
            document.title = "My account | @i - artificial social media";
        }
    }, []);

    return (
        <Outlet/>
    );
}

export default Base;
