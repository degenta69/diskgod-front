export const isUserGroupAdmin = (chat, user) => {
    if (chat.isGroupChat) {
        if (chat.groupAdmin._id === user.id) {
            return true;
        }
        return false
    }
    return false;
};

