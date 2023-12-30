'use client';
import styles from "./styles/Messages.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComment, faImage } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useRef } from "react"
import { pusherClient } from "@/lib/pusher";
import Image from "next/image";
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(r => r.json());
import { format, parseISO, isWithinInterval, subDays, isThisYear } from 'date-fns';

const fetchChatMessages = async (chatRoomId: string) => {
    const response = await fetch(`/api/message?chatRoomId=${chatRoomId}`);
    const messages = await response.json();
    return messages;
}

export default function Messages(params: { user: any }) {

    const { user } = params;

    const { data: chatRooms, error: chatRoomsError } = useSWR(`/api/chatroom?id=${user.uid}`, fetcher);

    const [chatRoom, setChatRoom] = useState();

    const [chat, setChat] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [numOnlineUsers, setNumOnlineUsers] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [mountedChat, setMountedChat] = useState(false);

    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [groupedChat, setGroupedChat] = useState({});

    useEffect(() => {
        if (lastMessageRef.current && messagesContainerRef.current) {
            const isAtBottom =
                messagesContainerRef.current.scrollTop + messagesContainerRef.current.clientHeight + 500 >=
                lastMessageRef.current.offsetTop;

            if (isAtBottom) {
                lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [chat]);

    useEffect(() => {
        const newGroupedChat = chat.reduce((acc, message) => {
            const messageDate = parseISO(message.createdAt);
            let date;
            if (isWithinInterval(messageDate, { start: subDays(new Date(), 7), end: new Date() })) {
                date = format(messageDate, 'EEEE');
            } else if (isThisYear(messageDate)) {
                date = format(messageDate, 'MMMM dd');
            } else {
                date = format(messageDate, 'MMMM dd, yyyy');
            }
            const time = format(messageDate, 'hh:mm a');

            if (!acc[date]) {
                acc[date] = [];
            }

            acc[date].push({
                ...message,
                time,
            });

            return acc;
        }, {});

        setGroupedChat(newGroupedChat);
    }, [chat]);
    useEffect(() => {
        if (chatRoom) {
            var channel = pusherClient.subscribe(`presence-${chatRoom.uid}`);
            channel.bind('incoming-message', (data: any) => {
                setChat((chat) => [...chat, data]);
            });

            channel.bind('pusher:subscription_succeeded', (members: any) => {
                setNumOnlineUsers(members.count);
            });

            channel.bind('pusher:member_added', (members: any) => {
                setNumOnlineUsers(numOnlineUsers + 1);
                setOnlineUsers((onlineUsers) => [...onlineUsers, members.id]);
            });

            channel.bind('pusher:member_removed', (members: any) => {
                setNumOnlineUsers(numOnlineUsers - 1);
                setOnlineUsers(onlineUsers.filter((userId) => userId !== members.id));
            })

            return () => {
                pusherClient.unsubscribe(`presence-${chatRoom.uid}`);
            }
        }
    }, [pusherClient, chatRoom]);

    useEffect(() => {
        if (chatRooms && !mountedChat) {
            setChatRoom(chatRooms[0]);
            setMountedChat(true);
        }
    }, [chatRooms])

    useEffect(() => {
        const fetchMessages = async (chatRoomId: string) => {
            const res = await fetchChatMessages(chatRoomId);
            setChat(res);
        }

        if (chatRoom) {
            fetchMessages(chatRoom.uid);
        }
    }, [chatRoom])

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setMessage(event.target.value);
    };

    const handleSubmit = async () => {
        if (chatRoom) {
            const res = await fetch('/api/message', {
                method: 'POST',
                body: JSON.stringify({ chatRoomId: chatRoom.uid, senderId: user.uid, message: message }),
            });

            if (res.ok) {
                setMessage('');
            }
        }
    }



    return (
        <div className={styles.messages}>
            <div className={styles.recipients}>
                <div className={styles.recipientsHeader}>
                    <FontAwesomeIcon icon={faComment} className={styles.icon} />Messages
                </div>
                <div className={styles.chatRooms}>
                    {chatRooms?.map((chatRoom: any, index: number) => {
                        const chatRoomUser = chatRoom.users.filter((userInfo: any) => userInfo.uid !== user.uid)[0];
                        return (
                            <div key={index} className={styles.recipient} onClick={() => setChatRoom(chatRoom)}>
                                <Image className={styles.recipientImage} src={chatRoomUser.profilePic} alt="Recipient Profile Picture" width={50} height={50} />
                                <div className={styles.recipientName}>{chatRoomUser.displayName}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={styles.messenger}>
                {chatRoom &&
                    <div className={styles.messageHeader}>
                        <div className={styles.messengerHeaderInfo}>
                            <div className={styles.userInfo}>
                                <Image className={styles.recipientImage} src={chatRoom.users[0].profilePic} alt="Recipient Profile Picture" width={80} height={80} />
                                <div className={styles.messageHeaderName}>{chatRoom.users[0].displayName}</div>
                            </div>
                            <div className={styles.messageHeaderStatus}>
                                {onlineUsers.includes(chatRoom.users[0].uid) || numOnlineUsers > 1 ? <div className={styles.online} /> : <div className={styles.offline} />}
                                {onlineUsers.includes(chatRoom.users[0].uid) || numOnlineUsers > 1 ? 'Online' : 'Offline'}
                            </div>
                        </div>
                    </div>
                }
                <div className={styles.messengerBody} ref={messagesContainerRef}>
                    {Object.entries(groupedChat).map(([date, messages], index) => (
                        <div key={index}>
                            <div className={styles.date}>{date}</div>
                            {messages.map((message, i) => (
                                <div key={i} className={message.userId === user.uid ? styles.sentMessage : styles.receivedMessage} ref={i === messages.length - 1 ? lastMessageRef : null}>
                                    <div className={message.userId === user.uid ? styles.sentText : styles.receivedText}>{message.text}</div>
                                    <div className={message.userId === user.uid ? styles.sentTime : styles.receivedTime}>{message.time}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className={styles.messengerFooter}>
                    <textarea className={styles.messageInput} aria-multiline name='input' value={message} placeholder="Type a message..." onChange={handleInputChange} />
                    <div className={styles.inputControls}>
                        <FontAwesomeIcon className={styles.attachmentButton} icon={faImage} />
                        <button className={styles.sendButton} onClick={() => handleSubmit()}>Send</button>
                    </div>
                </div>
            </div>
        </div >
    )
}