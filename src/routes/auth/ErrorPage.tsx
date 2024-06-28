// very helpful: https://stackoverflow.com/a/76126878

import React from "react";
import {useRouteError, isRouteErrorResponse, Link} from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        errorMessage = error.data.errorMessage;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = 'Unknown error';
    }

    return (
        <>
            <div className="absolute top-0 left-0 pl-2 pt-1">
                <Link to="/" className="flex flex-row items-center justify-center text-navy-500 text-nowrap">
                    <span className="material-symbols material-symbol-md mt-0.5">arrow_back</span>
                    <span className="ml-1 text-base font-semibold">
                        Go Back
                    </span>
                </Link>
            </div>
            <div className="flex w-full h-full">
                <div className="flex flex-col flex-grow justify-center items-center w-full">
                    <div className="flex justify-center items-center w-full my-4">
                        <span className="text-4xl font-bold text-navy-300">
                            Oops!
                        </span>
                    </div>
                    <div className="flex justify-center items-center w-full my-4">
                        <span className="italic text-navy-300">
                            An unexpected error has occurred
                        </span>
                    </div>
                    <div className="flex justify-center items-center w-full my-4">
                        <span className="text-sm italic text-red-400">
                            Detail: {errorMessage}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ErrorPage;
