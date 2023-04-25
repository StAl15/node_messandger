import {Image, Img, TabPanel, TabPanels, Text, VStack} from "@chakra-ui/react";
import {useContext, useEffect, useRef} from "react";
import {FriendContext, MessagesContext} from "./Home";
import nothing from "./nothing.svg"
import {ChatBox} from "./ChatBox";

export const Chat = ({userid}) => {
    const {friendList} = useContext(FriendContext)
    const {messages} = useContext(MessagesContext)
    const bottomDiv = useRef(null);

    useEffect(() => {
        bottomDiv.current?.scrollIntoView()
    }, []);

    return friendList.length > 0 ? (
            <VStack h={"100%"} justify={"end"}>
                <TabPanels overflowY={"scroll"}>
                    {friendList.map((friend) =>
                        <VStack
                            flexDir={"column-reverse"}
                            as={TabPanel}
                            key={`chat:${friend.userid}`}
                            w={"100%"}
                        >
                            <div ref={bottomDiv}/>
                            {messages.filter(
                                msg =>
                                    msg.to === friend.userid
                                    ||
                                    msg.from === friend.userid
                            ).map((message, index) => (
                                <Text
                                    m={message.to === friend.userid
                                        ? "1rem 0 0 auto !important"
                                        : "1rem auto 0 0 !important"
                                    }
                                    maxW={"50%"}
                                    key={`msg:${friend.username}.${index}`}
                                    fontSize={"lg"}
                                    bg={message.to === friend.userid ? "blue.100" : "gray.100"}
                                    color={"gray.800"}
                                    borderRadius={"10px"}
                                    p={"0.5rem 1rem"}
                                >
                                    {message.content}
                                </Text>
                            ))}
                        </VStack>
                    )}
                </TabPanels>
                <ChatBox userid={userid}/>
            </VStack>
        ) :
        (
            <VStack justify={"center"} w={"100%"} h={"100%"} textAlign={"center"} fontSize={"lg"}>
                <VStack>
                    <Img w={"20vw"} h={"20vw"} src={nothing}/>
                    <Text>No friends</Text>
                </VStack>
            </VStack>
        )
};