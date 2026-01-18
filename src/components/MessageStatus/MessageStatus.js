import React from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll'; // Double Tick
import DoneIcon from '@mui/icons-material/Done'; // Single Tick
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Clock (Sending) (Optional usage if we tracked local sending state)
import { Box } from '@material-ui/core';

const MessageStatus = ({ message, chat, currentUser }) => {
    // Safety checks
    if (!currentUser || !message || !message.sender) return null;

    const senderId = message.sender._id || message.sender; // Handle populated object or string ID
    const currentUserId = currentUser.id || currentUser._id;

    // Only show status for messages sent by the current user
    if (senderId !== currentUserId) return null;

    if (!chat || !chat.users) return null;

    const isGroup = chat.isGroupChat;
    const usersInChat = chat.users;

    // Logic for "Read":
    // Normalize readBy to strings
    const readByList = (message.readBy || []).map(id => (id._id || id).toString());
    const currentUserIdStr = currentUserId.toString();

    let isRead = false;

    if (!isGroup) {
        // ROBUST CHECK: In 1-on-1, if ANYONE else has read it, it is read.
        // We don't need to strictly find the other user object to know this.
        const otherReaders = readByList.filter(id => id !== currentUserIdStr);

        if (otherReaders.length > 0) {
            isRead = true;
        }

    } else {
        // Group: Check if everyone else has read
        // Standard: Blue = Everyone read.

        // Filter out self from required count
        const requiredReaders = usersInChat.length - 1;

        // Count readers in message.readBy excluding self
        const readersCount = readByList.filter(id => id !== currentUserIdStr).length;


        if (requiredReaders > 0 && readersCount >= requiredReaders) {
            isRead = true;
        }
    }

    return (
        <Box component="span" style={{ marginLeft: '4px', verticalAlign: 'bottom', display: 'inline-flex' }}>
            <DoneAllIcon
                className={isRead ? 'read' : 'unread'}
                sx={{
                    fontSize: '16px',
                    color: isRead ? '#3b82f6' : '#9ca3af',
                    transition: 'color 0.3s ease'
                }}
                htmlColor={isRead ? '#3b82f6' : '#9ca3af'} // Fallback for various MUI versions
            />
        </Box>
    );
};

export default MessageStatus;
