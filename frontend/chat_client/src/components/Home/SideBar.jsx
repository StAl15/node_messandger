import {
    Button,
    Circle,
    Divider,
    Heading,
    HStack,
    Tab,
    TabList,
    Tabs,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {ChatIcon} from "@chakra-ui/icons";
import {useContext} from "react";
import {FriendContext} from "./Home";
import {AddFriendModal} from "./AddFriendModal";

export const SideBar = props => {
    const {friendList} = useContext(FriendContext);
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <>
            <VStack py={"1.4rem"}>
                <HStack justify={"space-evenly"} w={"100%"}>
                    <Heading size="md">Add Friend</Heading>
                    <Button onClick={onOpen}>
                        <ChatIcon/>
                    </Button>
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