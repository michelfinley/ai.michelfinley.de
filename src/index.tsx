import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";


import './index.css';
import './MaterialSymbolsOutlined.css';

import {AuthProvider} from "./context/AuthContext"
import {NotificationProvider} from "./context/NotificationContext";

import {
    AuthErrorPage,
    AuthLogin,
    AuthSignUp
} from "./routes/auth";
import {
    MyAccountBase,
    MyAccountErrorPage,
    MyAccountFavorites,
    MyAccountFollowing,
    MyAccountNotFoundPage,
    MyAccountOverview,
    MyAccountSettings
} from "./routes/myaccount";
import {
    RootBase,
    RootErrorPage,
    RootMainPage,
    RootNotFoundPage,
    RootPostPage,
    RootSearchPage,
    RootTagPage,
    RootUserPage
} from "./routes/root";

const router = createBrowserRouter(
    createRoutesFromElements([
        <Route path="/login" element={ <AuthLogin />  } errorElement={<AuthErrorPage />}/>,
        <Route path="/signup" element={ <AuthSignUp />  } errorElement={<AuthErrorPage />}/>,

        <Route
            path="/*"
            element={
                <RootBase />
            }
            errorElement={<RootErrorPage />}
        >
            <Route path="" element={
                <RootMainPage/>
            } errorElement={<RootErrorPage />}/>,

            <Route path="myaccount/*" element={
                <MyAccountBase/>
            } errorElement={<MyAccountErrorPage />}>

                <Route path="" element={
                    <MyAccountOverview/>
                } errorElement={<MyAccountErrorPage />}/>,

                <Route path="settings" element={
                    <MyAccountSettings/>
                } errorElement={<MyAccountErrorPage />}/>,

                <Route path="following" element={
                    <MyAccountFollowing/>
                } errorElement={<MyAccountErrorPage />}/>,

                <Route path="favorites" element={
                    <MyAccountFavorites/>
                } errorElement={<MyAccountErrorPage />}/>,

                <Route path="*" element={
                    <MyAccountNotFoundPage />
                } errorElement={<MyAccountErrorPage />}/>,

            </Route>,

            <Route path="search" element={
                <RootSearchPage/>
            } errorElement={<RootErrorPage />}/>,

            <Route path="post/:postID" element={
                <RootPostPage/>
            } errorElement={<RootErrorPage />}/>,

            <Route path="tag/:tagname" element={
                <RootTagPage/>
            } errorElement={<RootErrorPage />}/>,

            <Route path=":username" element={
                <RootUserPage />
            } errorElement={<RootErrorPage />}/>,

            <Route path="*" element = {
                <RootNotFoundPage />
            } errorElement={<RootErrorPage />}/>,

        </Route>,
        ]
    )
);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <AuthProvider>
            <NotificationProvider>
                <RouterProvider router={router} />
            </NotificationProvider>
        </AuthProvider>
    </React.StrictMode>
);
