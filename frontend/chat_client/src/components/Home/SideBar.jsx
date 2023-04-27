import {
    Button,
    Circle,
    Divider,
    Heading,
    HStack, Icon, Image,
    Tab,
    TabList,
    Tabs,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {ChatIcon} from "@chakra-ui/icons";
import {useContext, useMemo} from "react";
import {FriendContext} from "./Home";
import {AddFriendModal} from "./AddFriendModal";
import {logoutIcon} from "./logoutIcon";
import {AccountContext, UserContext} from "../AccountContext";
import {useNavigate} from "react-router-dom";

export const SideBar = props => {
    const {friendList} = useContext(FriendContext);
    const {setUser} = useContext(AccountContext);
    const navigate = useNavigate()

    useMemo(() => friendList);

    const handleLogout = () => {
        fetch("http://localhost:4000/auth/logout", {
            method: 'GET'
        })
            .catch(err => {
                console.log(err)
                return err
            })
            .then(r => {
                if (!r.ok || !r || r.status >= 400) {
                    console.log('error')
                    return
                }
                navigate('/')
                setUser({loggedIn: false})
                // console.log(user)
            })
    }

    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <>
            <VStack py={"1.4rem"}>
                <HStack alignItems={"center"} justify={"space-between"} px={"20px"} w={"100%"}>
                    <Heading size="md">Add Friend</Heading>
                    <HStack>
                        <Button onClick={onOpen}>
                            <ChatIcon/>
                        </Button>
                        <Button onClick={() => handleLogout()}>
                            <Icon as={logoutIcon}/>
                        </Button>
                    </HStack>

                </HStack>
                <Divider/>
                <VStack as={TabList}>
                    {friendList.map((friend) =>
                        <HStack as={Tab} key={`friend:${friend.userid}`}>
                            <Circle bg={friend.connected ? "green.700" : "gray.500"} w={"20px"} h={"20px"}/>
                            <Text>{friend.username}</Text>
                        </HStack>
                    )}
                </VStack>
            </VStack>
            <AddFriendModal isOpen={isOpen} onClose={onClose}/>
        </>
    );
};