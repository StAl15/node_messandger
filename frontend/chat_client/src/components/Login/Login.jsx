import {
    VStack,
    ButtonGroup,
    FormControl,
    Button,
    FormErrorMessage,
    FormLabel,
    Input, Heading, Text
} from "@chakra-ui/react";
import {Form, Formik, useFormik} from "formik";
import * as Yup from "yup"
import {TextField} from "../TextField";
import {useNavigate} from "react-router-dom";
import {formSchema} from '../../schemas/index'
import {useContext, useState} from "react";
import {AccountContext} from "../AccountContext";

export const Login = () => {
    const {setUser} = useContext(AccountContext)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    return (
        <>
            <Formik
                initialValues={{
                    username: "",
                    password: ""
                }}
                validationSchema={formSchema}
                onSubmit={(values, actions) => {
                    const vals = {...values}
                    actions.resetForm();
                    fetch("http://localhost:4000/auth/login", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(vals),
                    }).catch(err => {
                        return;
                    }).then(res => {
                        if (!res || !res.ok || res.status >= 400) {
                            return;
                        }
                        return res.json()
                    }).then(data => {
                        if (!data) return;
                        setUser({...data})
                        if (data.status) {
                            setError(data.status)
                        } else if (data.loggedIn) {
                            navigate('/home');
                        }
                    })
                }}>
                <VStack
                    as={Form}
                    w={{base: "90%", md: "500px"}}
                    m={"auto"}
                    justify={"center"}
                    h={"100vh"}
                    spacing={"1rem"}
                >
                    <Heading>
                        Log In
                    </Heading>
                    <Text as={'p'} color={'red.500'}>
                        {error}
                    </Text>

                    <TextField
                        name={"username"}
                        placeholder={"Enter username"}
                        autoComplete={"off"}
                        label={"Username"}
                    />
                    <TextField
                        name={"password"}
                        placeholder={"Enter Password"}
                        autoComplete={"off"}
                        label={"Password"}
                        type={'password'}
                    />

                    <ButtonGroup pt={"1rem"}>
                        <Button colorScheme={"teal"} type={"submit"}>Log in</Button>
                        <Button onClick={() => navigate('/register')} type={"submit"}>Create Account</Button>
                    </ButtonGroup>
                </VStack>
            </Formik>
        </>
    );
};