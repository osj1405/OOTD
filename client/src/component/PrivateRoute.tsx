import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import { RootState } from "../store/rootStore";
import React, { JSX } from "react";

type Props = {
    children: JSX.Element
};

export default function PrivateRoute({children}: Props){
    const isLoggedIn = useSelector((state: RootState)=> !!state.auth.backendJWTToken)
    const initialized = useSelector((state: RootState) => state.auth.initialized)

    if(!initialized){
        return null;
    }

    return isLoggedIn ? children : <Navigate to="/" replace />;
    // return children;
}
