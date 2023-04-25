import {
    Button, Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import {TextField} from "../TextField";
import {Form, Formik} from "formik";
import {friendSchema} from "../../schemas";
import socket from "../../socket";
import {useCallback, useContext, useState} from "react";
import {FriendContext} from "./Home";

export const AddFriendModal = ({isOpen, onClose}) => {
    const [error, setError] = useState("");
    const closeModal = useCallback(
        () => {
            setError('')
            onClose()
        },
        [onClose],
    );

    const {setFriendList} = useContext(FriendContext)

    return (
        <Modal isOpen={isOpen} onClose={closeModal} isCentered={true}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    Add a friend
                </ModalHeader>
                <ModalCloseButton/>
                <Formik
                    initialValues={{friendName: ""}}
                    onSubmit={(values) => {
                        socket.emit(
                            "add_friend",
                            values.friendName,
                            ({errorMsg, done, newFriend}) => {
                                if (done) {
                                    setFriendList(c => [newFriend, ...c])
                                    closeModal()
                                    return;
                                }
                                setError(errorMsg)
                            })
                    }}
                    validationSchema={friendSchema}
                >

                    <Form>
                        <ModalBody>
                            <Heading fontSize={"xl"} as={"p"} color={"red.500"} textAlign={"center"}>
                                {error}
                            </Heading>
                            <TextField
                                label={"Friend's name"}
                                placeholder={"Enter friend's username"}
                                autoComplete={"off"}
                                name={"friendName"}/>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme={"blue"} type={"submit"}>
                                Submit
                            </Button>
                        </ModalFooter>
                    </Form>
                </Formik>
            </ModalContent>
        </Modal>
    );
};