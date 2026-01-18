export const isUserGroupAdmin = (chat, user) => {
    if (chat.isGroupChat) {
        const adminId = chat.groupAdmin?._id || chat.groupAdmin?.id || chat.groupAdmin;
        const userId = user?._id || user?.id;

        if (adminId && userId && adminId.toString() === userId.toString()) {
            return true;
        }
        return false
    }
    return false;
};

