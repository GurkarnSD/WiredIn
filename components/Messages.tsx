'use client';
import styles from "./styles/Messages.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComment, faImage, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useRef } from "react"
import { pusherClient } from "@/lib/pusher";
import Image from "next/image";
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(r => r.json());
import { format, isWithinInterval, subDays, isThisYear } from 'date-fns';
import Modal from "./Modal";
import axios from "axios";
import { ChatMessage, User, UserChatRoom } from "@/types";
import { Members } from "pusher-js";
import Link from "next/link";

const fetchChatMessages = async (chatRoomId: string) => {
    const response = await fetch(`/api/message?chatRoomId=${chatRoomId}`);
    const messages = await response.json();
    return messages;
}

type ChatUser = {
    id: string;
    info: {
        name: string;
        userId: string;
    }
}

export default function Messages(params: { user: User }) {

    const { user } = params;

    const { data: chatRooms } = useSWR<UserChatRoom[]>(`/api/chatroom`, fetcher);

    const [chatRoom, setChatRoom] = useState<UserChatRoom>();

    const [chat, setChat] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState("");
    const [numOnlineUsers, setNumOnlineUsers] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [mountedChat, setMountedChat] = useState(false);
    const [groupedChat, setGroupedChat] = useState<Record<string, (ChatMessage & { time: string })[]>>({});

    const ref = useRef<HTMLDivElement>(null);

    // Buggy
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [chat]);

    useEffect(() => {
        const newGroupedChat = chat.reduce((acc: { [key: string]: any[] }, message) => {
            const messageDate = message.createdAt;
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
            const channel = pusherClient.subscribe(`presence-${chatRoom.uid}`);
            channel.bind('incoming-message', (data: ChatMessage) => {
                setChat((chat) => [...chat, data]);
            });

            channel.bind('pusher:subscription_succeeded', (members: Members) => {
                setNumOnlineUsers(members.count);
            });

            channel.bind('pusher:member_added', (members: ChatUser) => {
                setNumOnlineUsers(numOnlineUsers + 1);
                setOnlineUsers((onlineUsers) => [...onlineUsers, members.id]);
            });

            channel.bind('pusher:member_removed', (members: ChatUser) => {
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


    const handleImageClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };

    const removeImage = (imageUrl: string) => {
        const index = images.indexOf(imageUrl);
        if (index > -1) {
            const newImages = [...images];
            newImages.splice(index, 1);
            setImages(newImages);
            const newImageFiles = [...imageFiles];
            newImageFiles.splice(index, 1);
            setImageFiles(newImageFiles);
            setError('');
        }
    }

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setMessage(event.target.value);
    };

    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxImages = 5;

    const [error, setError] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        setIsModalOpen(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {

            if (images.length >= maxImages) {
                setError(`You can only upload ${maxImages} images at a time.`);
                return;
            }

            const newImageFiles = Array.from(e.target.files);
            const invalidFiles = newImageFiles.filter(
                (file) => !validFileTypes.includes(file.type)
            );

            if (invalidFiles.length > 0) {
                setError('Files must be in JPG/PNG format');
                return;
            }

            if (e.target) {
                e.target.value = '';
            }

            setError('');
            setImageFiles([...imageFiles, ...newImageFiles]);
            setImages([...images, ...newImageFiles.map((file) => URL.createObjectURL(file))]);
        }
    };

    const handleSubmit = async () => {
        if (chatRoom && (message !== "" || imageFiles.length > 0)) {

            let attachments: string[] = [];

            if (imageFiles.length > 0) {
                const imageUploadPromises: Promise<string>[] = imageFiles.map(async (file) => {
                    const postPicData = new FormData();
                    postPicData.append('image', file);
                    postPicData.append('type', file.type);

                    const response = await axios.post('/api/image', postPicData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    return response.data.key;
                });

                attachments = await Promise.all(imageUploadPromises);
            }

            const res = await fetch('/api/message', {
                method: 'POST',
                body: JSON.stringify({ chatRoomId: chatRoom.uid, message: message, attachments }),
            });

            if (res.ok) {
                setMessage('');
                setImageFiles([]);
                setImages([]);
                setError('');
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
                    {chatRooms?.map((room: UserChatRoom, index: number) => {
                        const chatRoomUser = room.users[0];
                        return (
                            <div key={index} className={`${styles.recipient} ${room.id === chatRoom?.id && styles.selectedChatRoom}`} onClick={() => setChatRoom(room)}>
                                {chatRoomUser ?
                                    <>
                                        <Image className={styles.recipientImageList} src={chatRoomUser.profilePic} alt="Recipient Profile Picture" width={50} height={50} />
                                        <div className={styles.recipientName}>{chatRoomUser.displayName}</div>
                                    </>
                                    :
                                    <>
                                        <div className={styles.recipientImageList} />
                                        <div className={styles.recipientName}>Deleted User</div>
                                    </>
                                }

                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={styles.messenger}>
                {chatRoom?.users &&
                    <div className={styles.messageHeader}>
                        {chatRoom.users.length > 0 ?
                            <Link className={styles.userInfo} href={`/profile/${chatRoom.users[0].displayName}`}>
                                <Image className={styles.recipientImageHeader} src={chatRoom.users[0].profilePic} alt="Recipient Profile Picture" width={80} height={80} />
                                <div className={styles.messageHeaderName}>{chatRoom.users[0].displayName}</div>
                            </Link>
                            :
                            <div className={styles.userInfo}>
                                <div className={styles.recipientImageHeader} />
                                <div className={styles.messageHeaderName}>Deleted User</div>
                            </div>
                        }
                        <div className={styles.messageHeaderStatus}>
                            {chatRoom.users.length > 0 && onlineUsers.includes(chatRoom.users[0].uid) || numOnlineUsers > 1 ? <div className={styles.online} /> : <div className={styles.offline} />}
                            {chatRoom.users.length > 0 && onlineUsers.includes(chatRoom.users[0].uid) || numOnlineUsers > 1 ? 'Online' : 'Offline'}
                        </div>
                    </div>
                }
                <div className={styles.messengerBody}>
                    {Object.entries(groupedChat).map(([date, messages]: [string, (ChatMessage & { time: string })[]], index: number) => (
                        <div key={index}>
                            <div className={styles.date}>{date}</div>
                            {messages.map((message: ChatMessage & { time: string }, i: number) => (
                                <div key={i} className={message.userId === user.uid ? styles.sentMessage : styles.receivedMessage} >
                                    {message.attachments && message.attachments.length > 0 && (
                                        <div className={styles.attachments}>
                                            {message.attachments.map((attachment: string, index: number) => (
                                                <div key={index} className={message.userId === user.uid ? styles.sentAttachmentContainer : styles.receivedAttachmentContainer} onClick={() => openImageModal(attachment)}>
                                                    <Image className={styles.attachment} src={attachment} alt={''} width={0} height={0} unoptimized />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {message.text !== '' && <div className={message.userId === user.uid ? styles.sentText : styles.receivedText}>{message.text}</div>}
                                    <div className={message.userId === user.uid ? styles.sentTime : styles.receivedTime}>{message.time}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div ref={ref} />
                </div>
                <div className={styles.messengerFooter}>
                    <div className={styles.images}>
                        {images.map((image, index) => {
                            return (
                                <div key={index} className={styles.imageContainer} onClick={() => openImageModal(image)}>
                                    <Image className={styles.image} src={image} alt={''} width={0} height={0} />
                                    <FontAwesomeIcon icon={faXmark} className={styles.removeImageIcon} onClick={(event) => { event.stopPropagation(); removeImage(image); }} />
                                </div>
                            );
                        })}
                    </div>
                    {isModalOpen && selectedImage && (
                        <Modal isOpen={isModalOpen} onClose={closeImageModal}>
                            <div className={styles.modalImageContainer}>
                                <Image className={styles.modalImage} src={selectedImage} alt={''} width={0} height={0} sizes="100vw" />
                            </div>
                        </Modal>
                    )}
                    {error && <div className={styles.error}>{error}</div>}
                    {chatRoom && <>
                        <textarea className={styles.messageInput} aria-multiline name='input' value={message} placeholder="Type a message..." onChange={handleInputChange} />
                        <div className={styles.inputControls}>
                            <span>
                                <FontAwesomeIcon className={styles.attachmentButton} icon={faImage} onClick={handleImageClick} />
                                <input
                                    type="file"
                                    className={styles.imageInput}
                                    onChange={handleImageUpload}
                                    ref={imageInputRef}
                                    hidden
                                />
                            </span>
                            <button className={styles.sendButton} onClick={() => handleSubmit()}>Send</button>
                        </div>
                    </>}
                </div>
            </div>
        </div >
    )
}