import React, {Dispatch, SetStateAction, useContext} from "react";
import {Navigate, useLocation} from "react-router-dom";

import {AuthContext} from "../../context/AuthContext";

const RequireAuth = ({ children }: { children: React.JSX.Element }) => {
    const [token,] = useContext(AuthContext) as [string, Dispatch<SetStateAction<string | null>>];
    const location = useLocation();

    return token !== "null" ? children : <Navigate to="/login" replace state={{ path: location.pathname }} />
}

export default RequireAuth;
