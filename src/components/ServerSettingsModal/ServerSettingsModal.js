import React, { useState, useEffect } from 'react';
import {
    Box,
    Modal,
    Fade,
    Typography,
    TextField,
    IconButton,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Button,
    Drawer,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setmuiModalBool } from '../../state/muiModalState/muiModalState';
import uploadImageToCloud from '../../utils/uploadImageToCloud';
import { ApiRequestHandler } from '../../api/apiRepository';
import ApiMethods from '../../Models/ApiMethods';
import { addRerender } from '../../state/serverDetailData/serverDetailSlice';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import MenuIcon from '@mui/icons-material/Menu';

// --- Glass Styles ---
const GlassContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height: 650,
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(30px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    display: 'flex',
    overflow: 'hidden',
    color: 'white',
    outline: 'none',
    [theme.breakpoints.down('md')]: {
        width: '100vw', // Full width on mobile/tablet
        height: '100vh', // Full height
        borderRadius: 0,
        border: 'none',
        flexDirection: 'column'
    }
}));

const SidebarContent = ({ setActiveTab, activeTab, handleLeaveGroup }) => (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', p: 3, background: 'rgba(15, 23, 42, 1)' }}>
        <Typography variant="h6" sx={{ fontWeight: '900', mb: 4, px: 2, letterSpacing: '0.05em', color: '#fff' }}>SETTINGS</Typography>

        <Box sx={{ flex: 1 }}>
            {['Overview', 'Members', 'Invites'].map((text, index) => (
                <Box
                    key={text}
                    onClick={() => setActiveTab(index)}
                    sx={{
                        py: 1.5,
                        px: 2,
                        mb: 1,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: activeTab === index ? 'rgba(255,255,255,0.1)' : 'transparent',
                        color: activeTab === index ? 'white' : 'rgba(255,255,255,0.5)',
                        transition: 'all 0.2s ease',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }
                    }}
                >
                    <Typography variant="body1" fontWeight={activeTab === index ? 'bold' : '500'}>{text}</Typography>
                </Box>
            ))}
        </Box>

        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
            <Box
                onClick={handleLeaveGroup}
                sx={{ p: 1.5, borderRadius: '8px', cursor: 'pointer', color: '#ff4d4d', display: 'flex', alignItems: 'center', gap: 1.5, '&:hover': { background: 'rgba(255, 0, 0, 0.1)' } }}
            >
                <LogoutIcon fontSize="small" />
                <Typography variant="body2" fontWeight="bold">Leave Server</Typography>
            </Box>
        </Box>
    </Box>
);

const ContentArea = styled(Box)({
    flex: 1,
    padding: '0px',
    overflowY: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
});

const NeonButton = styled('button')(({ theme, variant, color }) => ({
    background: variant === 'outlined' ? 'transparent' : (color === 'red' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 255, 0.1)'),
    color: color === 'red' ? '#ff4d4d' : '#00ffff',
    fontWeight: 'bold',
    padding: '10px 24px',
    borderRadius: '8px',
    border: `1px solid ${color === 'red' ? '#ff4d4d' : '#00ffff'}`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    '&:hover': {
        background: color === 'red' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 255, 0.2)',
        boxShadow: `0 0 15px ${color === 'red' ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 255, 0.3)'}`,
        transform: 'translateY(-1px)'
    },
    '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
        boxShadow: 'none'
    }
}));

const StyledTextField = styled(TextField)({
    marginBottom: '24px',
    '& .MuiInputBase-input': {
        color: '#ffffff !important', // Force white text
        fontWeight: 500,
        '-webkit-text-fill-color': '#ffffff !important', // CRITICAL for WebKit
    },
    '& .MuiInputBase-input.Mui-disabled': {
        '-webkit-text-fill-color': 'rgba(255,255,255,0.7) !important', // CRITICAL for Disabled inputs
        color: 'rgba(255,255,255,0.7) !important',
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255,255,255,0.6) !important',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#00ffff !important',
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '12px',
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.1)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#00ffff',
            borderWidth: '2px'
        },
    },
});

// --- Alert/Confirmation Overlay ---
const AlertOverlay = ({ open, title, message, onConfirm, onCancel, type = 'danger' }) => {
    if (!open) return null;
    return (
        <Box sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <Box sx={{
                width: '400px', p: 4, borderRadius: '20px',
                background: type === 'danger' ? 'rgba(40, 10, 10, 0.95)' : 'rgba(20, 20, 30, 0.95)',
                border: type === 'danger' ? '1px solid rgba(255, 50, 50, 0.3)' : '1px solid rgba(100, 100, 255, 0.3)',
                boxShadow: type === 'danger' ? '0 0 40px rgba(255, 0, 0, 0.2)' : '0 0 40px rgba(0, 0, 0, 0.5)',
                textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2,
                transform: 'scale(1)', animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                <Typography variant="h5" fontWeight="900" sx={{ color: type === 'danger' ? '#ff4d4d' : '#fff', letterSpacing: '1px' }}>
                    {title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                    {message}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
                    <Button
                        onClick={onCancel}
                        sx={{
                            color: 'rgba(255,255,255,0.6)',
                            fontWeight: 'bold',
                            px: 3,
                            '&:hover': { color: 'white', background: 'rgba(255,255,255,0.05)' }
                        }}
                    >
                        CANCEL
                    </Button>
                    <NeonButton
                        color={type === 'danger' ? 'red' : 'blue'}
                        onClick={onConfirm}
                        sx={{ minWidth: '120px' }}
                    >
                        {type === 'danger' ? 'CONFIRM' : 'OKAY'}
                    </NeonButton>
                </Box>
            </Box>
            <style>
                {`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                `}
            </style>
        </Box>
    );
};

const ServerSettingsModal = () => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.muiModalShow.value);
    const serverDetails = useSelector(state => state.serverDetail);
    const userInfo = useSelector(state => state.userInfo);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [currentServer, setCurrentServer] = useState(null);
    useEffect(() => {
        try {
            if (serverDetails.newState) {
                setCurrentServer(JSON.parse(serverDetails.newState));
            }
        } catch (e) { }
    }, [serverDetails.newState]);

    const [activeTab, setActiveTab] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [editValues, setEditValues] = useState({
        chatName: '',
        description: '',
        image: null,
        imageUrl: '',
        banner: null,
        bannerUrl: ''
    });
    const [loading, setLoading] = useState(false);

    // isAdmin calculation (derived, not state)
    const adminId = currentServer?.groupAdmin?._id || currentServer?.groupAdmin?.id || currentServer?.groupAdmin;
    const userId = userInfo?.newUser?._id || userInfo?.newUser?.id;
    const isAdmin = adminId && userId && adminId.toString() === userId.toString();

    // Confirmation Modal State
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: '',
        message: '',
        type: 'danger',
        onConfirm: () => { }
    });

    useEffect(() => {
        if (currentServer) {
            setEditValues({
                chatName: currentServer.chatName || '',
                description: currentServer.description || '',
                imageUrl: currentServer.Image || '',
                bannerUrl: currentServer.banner || ''
            });
        }
    }, [currentServer]);


    const handleClose = () => {
        dispatch(setmuiModalBool(false));
    };

    const handleSaveOverview = async () => {
        setLoading(true);
        try {
            let imgUrl = editValues.imageUrl;
            let banUrl = editValues.bannerUrl;

            // Simple check if it's a blob url (meaning new file)
            if (editValues.image instanceof File) {
                imgUrl = await uploadImageToCloud(editValues.image);
            }
            if (editValues.banner instanceof File) {
                banUrl = await uploadImageToCloud(editValues.banner);
            }

            const payload = {
                chatId: currentServer._id,
                chatName: editValues.chatName,
                description: editValues.description,
                Image: imgUrl,
                banner: banUrl
            };

            await ApiRequestHandler(
                '/api/chats/group/rename',
                ApiMethods.PUT,
                payload,
                (res) => {
                    dispatch(addRerender({}));
                    setLoading(false);
                    handleClose();
                },
                (err) => { console.error(err); setLoading(false); }
            );

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleLeaveGroup = () => {
        setConfirmState({
            open: true,
            title: 'LEAVE SERVER?',
            message: 'Are you sure you want to abandon this realm? You will need an invite to rejoin.',
            type: 'danger',
            onConfirm: async () => {
                await ApiRequestHandler(
                    '/api/chats/group/remove',
                    ApiMethods.PUT,
                    { chatId: currentServer._id, userId: userInfo.newUser._id },
                    (res) => {
                        dispatch(addRerender({}));
                        handleClose();
                    },
                    (err) => console.error(err)
                );
                setConfirmState(prev => ({ ...prev, open: false }));
            }
        });
    };

    const handleRemoveUser = (user) => {
        setConfirmState({
            open: true,
            title: `KICK ${user.name.toUpperCase()}?`,
            message: `Are you sure you want to remove ${user.name} from the server? They can rejoin if invited again.`,
            type: 'danger',
            onConfirm: async () => {
                await ApiRequestHandler(
                    '/api/chats/group/remove',
                    ApiMethods.PUT,
                    { chatId: currentServer._id, userId: user._id },
                    (res) => {
                        dispatch(addRerender({}));
                    },
                    (err) => console.error(err)
                );
                setConfirmState(prev => ({ ...prev, open: false }));
            }
        });
    };

    const handleClearChat = () => {
        setConfirmState({
            open: true,
            title: 'CLEAR CHAT HISTORY?',
            message: 'This will permanently delete ALL messages in this chat for everyone. This action cannot be undone.',
            type: 'danger',
            onConfirm: async () => {
                await ApiRequestHandler(
                    `/api/message/clear/${currentServer._id}`,
                    ApiMethods.DELETE,
                    {},
                    (res) => {
                        window.location.reload();
                    },
                    (err) => console.error(err)
                );
                setConfirmState(prev => ({ ...prev, open: false }));
            }
        });
    };




    if (!open || !currentServer) return null;

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropProps={{ timeout: 500, sx: { background: 'rgba(0,0,0,0.8)' } }}
        >
            <Fade in={open}>
                <GlassContainer>
                    <AlertOverlay
                        open={confirmState.open}
                        title={confirmState.title}
                        message={confirmState.message}
                        type={confirmState.type}
                        onConfirm={confirmState.onConfirm}
                        onCancel={() => setConfirmState(prev => ({ ...prev, open: false }))}
                    />

                    {/* Desktop Sidebar */}
                    {!isMobile && (
                        <Box sx={{ width: '260px', background: 'rgba(0, 0, 0, 0.2)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                            <SidebarContent setActiveTab={setActiveTab} activeTab={activeTab} handleLeaveGroup={handleLeaveGroup} />
                        </Box>
                    )}

                    {/* Mobile Sidebar Drawer */}
                    <Drawer
                        anchor="left"
                        open={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                        sx={{ zIndex: 1400 }} // FIX: Ensure drawer is above the modal (Modal is 1300)
                        PaperProps={{
                            sx: {
                                background: 'transparent',
                                boxShadow: 'none'
                            }
                        }}
                    >
                        <Box sx={{ width: 280, height: '100%', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                            <SidebarContent
                                setActiveTab={(idx) => { setActiveTab(idx); setMobileMenuOpen(false); }}
                                activeTab={activeTab}
                                handleLeaveGroup={handleLeaveGroup}
                            />
                        </Box>
                    </Drawer>

                    {/* Content Area */}
                    <ContentArea className="hideScrollbar">
                        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 20, right: 20, zIndex: 100, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                            <CloseIcon />
                        </IconButton>

                        {isMobile && (
                            <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ position: 'absolute', top: 20, left: 20, zIndex: 100, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                                <MenuIcon />
                            </IconButton>
                        )}

                        {/* Overview Tab with Hero Banner Layout */}
                        {activeTab === 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {/* Hero Banner Area */}
                                <Box sx={{
                                    height: '240px',
                                    minHeight: '240px',
                                    width: '100%',
                                    background: editValues.bannerUrl ? `url(${editValues.bannerUrl}) center center / cover no-repeat` : 'linear-gradient(135deg, #1e1e2f 0%, #2a2a40 100%)',
                                    position: 'relative'
                                }}>
                                    {isAdmin && (
                                        <Button component="label" sx={{
                                            position: 'absolute', top: 20, right: isMobile ? 60 : 80,
                                            bgcolor: 'rgba(0,0,0,0.6)', color: 'white', px: 2, py: 1,
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }, backdropFilter: 'blur(4px)',
                                            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px'
                                        }}>
                                            Change Banner
                                            <input hidden accept="image/*" type="file" onChange={(e) => {
                                                if (e.target.files[0]) setEditValues({ ...editValues, banner: e.target.files[0], bannerUrl: URL.createObjectURL(e.target.files[0]) })
                                            }} />
                                        </Button>
                                    )}
                                    {/* Overlay Gradient at bottom */}
                                    <Box sx={{ position: 'absolute', bottom: "-1px", left: 0, width: '100%', height: '80px', background: 'linear-gradient(to top, rgba(15, 23, 42, 1) 0%, transparent 100%)' }} />
                                </Box>

                                {/* Profile/Content Section overlapping Banner */}
                                <Box sx={{ px: isMobile ? 3 : 6, pb: 6, mt: -8, position: 'relative', zIndex: 2 }}>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
                                        {/* Avatar */}
                                        <Box sx={{ position: 'relative' }}>
                                            <Avatar
                                                src={editValues.imageUrl}
                                                sx={{
                                                    width: 128,
                                                    height: 128,
                                                    border: '8px solid #0f172a', // Matches modal bg
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                                    bgcolor: '#1e293b'
                                                }}
                                            />
                                            {isAdmin && (
                                                <Box sx={{
                                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
                                                    '&:hover .edit-overlay': { opacity: 1 }
                                                }}>
                                                    <Box className="edit-overlay" component="label" sx={{
                                                        width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        bgcolor: 'rgba(0,0,0,0.6)', opacity: 0, transition: '0.2s', cursor: 'pointer', color: 'white', fontWeight: 'bold', fontSize: '0.7rem'
                                                    }}>
                                                        EDIT
                                                        <input hidden accept="image/*" type="file" onChange={(e) => {
                                                            if (e.target.files[0]) setEditValues({ ...editValues, image: e.target.files[0], imageUrl: URL.createObjectURL(e.target.files[0]) })
                                                        }} />
                                                    </Box>
                                                </Box>
                                            )}
                                            {/* Online Indicator */}
                                            <Box sx={{ width: 28, height: 28, bgcolor: '#10b981', borderRadius: '50%', border: '6px solid #0f172a', position: 'absolute', bottom: 10, right: 5 }} />
                                        </Box>
                                    </Box>

                                    {/* Inputs */}
                                    <Box sx={{ maxWidth: '600px' }}>
                                        <StyledTextField
                                            fullWidth
                                            label="SERVER NAME"
                                            value={editValues.chatName}
                                            onChange={(e) => setEditValues({ ...editValues, chatName: e.target.value })}
                                            disabled={!isAdmin}
                                            variant="outlined"
                                            helperText={isAdmin ? "Visible to all members" : ""}
                                            sx={{ mb: 4 }}
                                        />

                                        <StyledTextField
                                            fullWidth
                                            label="DESCRIPTION"
                                            multiline
                                            rows={4}
                                            value={editValues.description}
                                            onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                                            disabled={!isAdmin}
                                            variant="outlined"
                                            placeholder="Tell the world what this realm is about..."
                                        />
                                    </Box>

                                    {isAdmin && (
                                        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
                                            <NeonButton onClick={handleSaveOverview} disabled={loading}>
                                                {loading ? "Saving Changes..." : "Save Changes"}
                                            </NeonButton>
                                            <Button onClick={() => setEditValues({ ...editValues, ...currentServer })} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}>Reset</Button>
                                        </Box>
                                    )}

                                    {/* Clear Chat Button */}
                                    {((isAdmin && currentServer.isGroupChat) || (!currentServer.isGroupChat)) && (
                                        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <NeonButton
                                                color="red"
                                                variant="outlined"
                                                onClick={handleClearChat}
                                                sx={{ width: '100%' }}
                                            >
                                                CLEAR CHAT HISTORY
                                            </NeonButton>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {/* Members Tab */}
                        {activeTab === 1 && (
                            <Box sx={{ p: isMobile ? 3 : 6, pt: isMobile ? 8 : 6 }}>
                                <Typography variant="h5" fontWeight="bold" mb={4} sx={{ letterSpacing: '0.05em' }}>MEMBERS — {currentServer.users?.length}</Typography>
                                <List>
                                    {currentServer.users?.map((u) => (
                                        <ListItem key={u._id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' }, borderRadius: '12px', mb: 1.5, py: 1.5, px: 2, border: '1px solid transparent', '&:hover': { borderColor: 'rgba(255,255,255,0.05)' } }}>
                                            <ListItemAvatar>
                                                <Avatar src={u.profilepic} sx={{ width: 44, height: 44 }} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography color="white" fontWeight="600" fontSize="1rem">{u.name} {currentServer.groupAdmin?._id === u._id && <span style={{ fontSize: '0.65rem', color: '#0f172a', background: '#00ffff', padding: '3px 8px', borderRadius: '6px', marginLeft: '12px', fontWeight: '800', verticalAlign: 'middle' }}>OWNER</span>}</Typography>}
                                                secondary={<Typography color="rgba(255,255,255,0.4)" variant="body2" mt={0.5}>{u.email}</Typography>}
                                            />
                                            {isAdmin && currentServer.groupAdmin?._id !== u._id && (
                                                <IconButton onClick={() => handleRemoveUser(u)} sx={{ color: '#ff4d4d', opacity: 0.5, '&:hover': { opacity: 1, background: 'rgba(255,0,0,0.1)' } }}>
                                                    <PersonRemoveIcon />
                                                </IconButton>
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        {/* Invites Tab */}
                        {activeTab === 2 && (
                            <Box sx={{ p: 10, pt: isMobile ? 12 : 10, textAlign: 'center', opacity: 0.6 }}>
                                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: 'rgba(255,255,255,0.2)' }}>INVITES</Typography>
                                <Typography variant="body1">
                                    Invite system is currently under maintenance. <br />
                                    Please manually add users in the wizard for now.
                                </Typography>
                            </Box>
                        )}

                    </ContentArea>
                </GlassContainer>
            </Fade>
        </Modal>
    );
};

export default ServerSettingsModal;
