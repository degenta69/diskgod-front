import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Checkbox,
    TextField,
    CircularProgress
} from '@mui/material';
import { ApiRequestHandler } from '../../api/apiRepository';
import UrlPaths from '../../Models/UrlPaths';
import ApiMethods from '../../Models/ApiMethods';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '12px',
        height: '40px',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
        '&.Mui-focused fieldset': { borderColor: '#00ffff' },
    },
});

const UserSelectionList = ({ selectedUsers, setSelectedUsers }) => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            await ApiRequestHandler(
                UrlPaths.SEARCH_USER.replace("?queryData", search),
                ApiMethods.GET,
                null,
                (res) => { setUsers(res.data); },
                (err) => { console.error(err); }
            );
            setLoading(false);
        };

        const timeoutId = setTimeout(() => {
            if (search) fetchUsers();
        }, 500); // Debounce

        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleToggle = (user) => {
        const currentIndex = selectedUsers.findIndex((u) => u._id === user._id);
        const newSelected = [...selectedUsers];

        if (currentIndex === -1) {
            newSelected.push(user);
        } else {
            newSelected.splice(currentIndex, 1);
        }
        setSelectedUsers(newSelected);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <StyledTextField
                placeholder="Search friends..."
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Box sx={{ flex: 1, overflowY: 'auto', className: 'hideScrollbar' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress sx={{ color: '#00ffff' }} />
                    </Box>
                ) : (
                    <List>
                        {users.map((user) => (
                            <ListItem
                                key={user._id}
                                button
                                onClick={() => handleToggle(user)}
                                sx={{
                                    borderRadius: '8px',
                                    mb: 1,
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                                }}
                            >
                                <Checkbox
                                    checked={selectedUsers.some(u => u._id === user._id)}
                                    sx={{
                                        color: 'rgba(255,255,255,0.3)',
                                        '&.Mui-checked': { color: '#00ffff' }
                                    }}
                                />
                                <ListItemAvatar>
                                    <Avatar src={user.profilepic} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.name}
                                    primaryTypographyProps={{ style: { color: 'white' } }}
                                    secondary={user.email}
                                    secondaryTypographyProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                                />
                            </ListItem>
                        ))}
                        {users.length === 0 && search && (
                            <p className="text-gray-500 text-center mt-4">No users found</p>
                        )}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default UserSelectionList;
