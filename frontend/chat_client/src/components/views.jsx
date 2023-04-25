import {Navigate, Route, Routes} from "react-router-dom";
import {SignUp} from "./Login/SignUp";
import {Login} from "./Login/Login";
import {Text} from "@chakra-ui/react";
import PrivateRoutes from "./PrivateRoutes";
import {useContext} from "react";
import {AccountContext} from "./AccountContext";
import {Home} from "./Home/Home";

export const Views = () => {
    const {user} = useContext(AccountContext)

    return user.loggedIn === null ? (
        <Text>Loading...</Text>
    ) : (
        <Routes>
            <Route path={"/"} element={<Login/>}/>
            <Route path={"/register"} element={<SignUp/>}/>
            <Route element={<PrivateRoutes/>}>
                <Route path={'/home'} element={<Home/>}/>
            </Route>
            <Route path="/*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
};