import {Navigate, Route, Routes} from "react-router-dom";
import {SignUp} from "./Login/SignUp";
import {Login} from "./Login/Login";

export const Views = () => {
    return (
        <Routes>
            <Route path={"/"} element={<Login />}/>
            <Route path={"/register"} element={<SignUp />}/>
            <Route path="/*" element={<Navigate to="/" replace/>}/>

        </Routes>
    );
};