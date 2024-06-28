import React from 'react';
import {Link} from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <>
            <div className="absolute top-0 left-0 pl-2 pt-1">
                <Link to="/myaccount" className="flex flex-row items-center justify-center text-navy-500 text-nowrap">
                    <span className="material-symbols material-symbol-md mt-0.5">arrow_back</span>
                    <span className="ml-1 text-base font-semibold">
                        Back to Account Overview
                    </span>
                </Link>
            </div>

            <div className="flex flex-row justify-center items-center w-full my-4 mt-12">
                <span className="text-4xl font-bold text-navy-300">
                    Not Found
                </span>
            </div>

            <div className="flex justify-center items-center w-full my-4">
                <span className="italic text-navy-300">
                    This page does not exist
                </span>
            </div>
        </>
    );
};

export default NotFoundPage;
