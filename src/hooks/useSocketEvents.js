import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../socket/socketioLogic';
import { addNewMessage, updateReadStatus } from '../state/messageData/messageDataSlice';
import { addRerender } from '../state/serverDetailData/serverDetailSlice';
import { updateOnlineUser } from '../state/userInfoData/userInfoSlice';

const useSocketEvents = () => {
    const dispatch = useDispatch();
    const serverDetails = useSelector((state) => state.serverDetail);
    const user = useSelector((state) => state.userInfo.newUser);

    // Memoize the active chat ID
    const getActiveChatId = useCallback(() => {
        try {
            if (serverDetails && serverDetails.newState) {
                const activeChat = JSON.parse(serverDetails.newState);
                return activeChat._id;
            }
            return null;
        } catch (e) {
            return null;
        }
    }, [serverDetails]);

    useEffect(() => {
        // STRICT CHECK: Ensure user has a valid ID before attempting connection setup
        // Initial state is an empty object, so (!user) is false, but user.id is empty
        if (!user || (!user._id && !user.id)) {
            console.log("[Socket] Waiting for valid User ID...");
            return;
        }

        // Ensure setup is called (idempotent-ish check usually needed, but relying on socket internals)
        // Ideally checking socket.connected is better, but 'setup' is custom 
        socket.emit("setup", user);

        const handleMessageReceived = (newMessageReceived) => {
            const activeChatId = getActiveChatId();

            if (!newMessageReceived.chat || !newMessageReceived.chat._id) {
                console.error("[SOCKET] Received Message has invalid Chat Accessor:", newMessageReceived);
                return;
            }

            const msgChatId = newMessageReceived.chat._id.toString();

            if (activeChatId && activeChatId.toString() === msgChatId) {
                dispatch(addNewMessage(newMessageReceived));

                // FX: Real-time Read Receipt
                // Since I am looking at this chat right now, mark it as read immediately.
                if (user && (user._id || user.id)) {
                    const userId = user._id || user.id;
                    socket.emit("mark chat read", { chatId: msgChatId, userId });
                }
            } else {
                // Future: Dispatch notification action
            }
        };

        const handleReadUpdate = (data) => {
            // data = { chatId, userId }
            // 1. Update active chat messages (Blue ticks)
            const activeChatId = getActiveChatId();

            if (activeChatId && activeChatId.toString() === data.chatId) {
                dispatch(updateReadStatus(data));
            }

            // 2. Refresh Sidebar (Update Unread Counts)
            // If I read it, my count goes down. 
            // If someone else reads it, my list usually doesn't show "read by others" count, 
            // but for consistency/safety, let's refresh.
            // Specifically, if *I* sent the "mark read", I need my badge to vanish.
            dispatch(addRerender());
        };

        const handleChatListUpdate = (message) => {
            // 1. Refresh Sidebar (Unread counts, New chats)
            dispatch(addRerender());

            // 2. CRITICAL FIX: Join the room dynamically!
            // If this is a new chat (or one we weren't in), we must join to get future messages real-time.
            if (message && message.chat && message.chat._id) {
                // Ensure ID is string
                const roomId = typeof message.chat._id === 'object' ? message.chat._id.toString() : message.chat._id;
                socket.emit("join room", roomId);
            }
        };

        const handleUserOnline = (userId) => {
            dispatch(updateOnlineUser({ userId, isOnline: true }));
        };

        const handleUserOffline = (userId) => {
            dispatch(updateOnlineUser({ userId, isOnline: false }));
        };

        const handleOnlineUsersList = (userIds) => {
            userIds.forEach(id => {
                dispatch(updateOnlineUser({ userId: id, isOnline: true }));
            });
        };

        socket.on("message received", handleMessageReceived);
        socket.on("chat read update", handleReadUpdate);
        socket.on("chat list update", handleChatListUpdate);
        socket.on("user online", handleUserOnline);
        socket.on("user offline", handleUserOffline);
        socket.on("online users list", handleOnlineUsersList);

        return () => {
            socket.off("message received", handleMessageReceived);
            socket.off("chat read update", handleReadUpdate);
            socket.off("chat list update", handleChatListUpdate);
            socket.off("user online", handleUserOnline);
            socket.off("user offline", handleUserOffline);
        };
    }, [dispatch, getActiveChatId, user]);
};

export default useSocketEvents;
