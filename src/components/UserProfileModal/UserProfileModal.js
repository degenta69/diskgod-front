import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeProfileModal } from '../../state/profileModal/profileModalSlice';
import { addUser, logoutUser } from '../../state/userInfoData/userInfoSlice'; // Using addUser to update local state
import { Avatar, IconButton, TextField, Button, CircularProgress, Tooltip } from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import './UserProfileModal.css';
import dayjs from 'dayjs';
import uploadImageToCloud from '../../utils/uploadImageToCloud'; // Utility for upload
import instance from '../../api/axios'; // Axios instance
import { socketDisconnect } from '../../socket/socketioLogic';

const UserProfileModal = () => {
    const dispatch = useDispatch();
    const { isOpen, targetUser } = useSelector(state => state.profileModal);
    const currentUser = useSelector(state => state.userInfo.newUser);
    const onlineUsers = useSelector(state => state.userInfo.onlineUsers) || {};
    const modalRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        about: '',
        banner: null, // File or URL
        profilepic: null // File or URL
    });
    const [previewBanner, setPreviewBanner] = useState('');
    const [previewPfp, setPreviewPfp] = useState('');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            // Initialize form data
            if (targetUser) {
                setFormData({
                    name: targetUser.name || '',
                    about: targetUser.about || '',
                });
                setPreviewBanner(targetUser.banner || '');
                setPreviewPfp(targetUser.profilepic || targetUser.image || '');
            }
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, targetUser]); // Don't add handleClose to deps to avoid loops if wrapped

    const handleClose = () => {
        setIsEditing(false);
        dispatch(closeProfileModal());
    };

    if (!isOpen || !targetUser) return null;

    const isInternalUser = currentUser && (currentUser._id === targetUser._id || currentUser.id === targetUser._id);
    const isOnline = onlineUsers[targetUser._id] || false;

    // Use default values if missing
    const currentBannerStyle = previewBanner ? { backgroundImage: `url(${previewBanner})` } : { backgroundColor: '#7289da' };
    const currentAvatarSrc = previewPfp;

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [type]: file }));
            if (type === 'banner') setPreviewBanner(URL.createObjectURL(file));
            if (type === 'profilepic') setPreviewPfp(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            let bannerUrl = targetUser.banner; // Default to existing
            let pfpUrl = targetUser.profilepic;

            // Upload Banner if changed
            if (formData.banner instanceof File) {
                const url = await uploadImageToCloud(formData.banner);
                if (url) bannerUrl = url;
            }
            // Upload PFP if changed
            if (formData.profilepic instanceof File) {
                const url = await uploadImageToCloud(formData.profilepic);
                if (url) pfpUrl = url;
            }

            const payload = {
                name: formData.name,
                about: formData.about,
                banner: bannerUrl,
                profilepic: pfpUrl
            };

            const response = await instance.put('/api/user/update', payload);

            // Update Redux
            dispatch(addUser(response.data));

            // Close Edit Mode
            setIsEditing(false);

            // Ideally we also update targetUser in profileModal but closing modal is easier
            handleClose();

        } catch (error) {
            console.error("Update failed", error);
            // Show toast?
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // 1. Clear Redux
        dispatch(logoutUser());
        // 2. Clear Local Storage
        localStorage.removeItem('diskGodUserToken');
        // 3. Disconnect Socket
        socketDisconnect();
        // 4. Close Modal
        handleClose();
        // 5. Force Redirect to Login (Full reload ensures clean state)
        window.location.href = "/";
    };

    return (
        <div className="profile-modal-overlay">
            <div className="profile-card" ref={modalRef}>
                {/* Banner */}
                <div className="profile-banner group relative" style={currentBannerStyle}>
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition">
                            <label htmlFor="banner-upload" className="cursor-pointer text-white flex flex-col items-center">
                                <PhotoCamera />
                                <span className="text-xs mt-1">Change Banner</span>
                            </label>
                            <input id="banner-upload" type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, 'banner')} />
                        </div>
                    )}
                    {isInternalUser && !isEditing && (
                        <>
                            <IconButton
                                style={{ position: 'absolute', top: 10, right: 10, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
                                onClick={() => setIsEditing(true)}
                            >
                                <EditIcon />
                            </IconButton>
                            <Tooltip title="Log Out">
                                <IconButton
                                    style={{ position: 'absolute', top: 10, left: 10, color: '#ff4d4d', backgroundColor: 'rgba(0,0,0,0.5)' }}
                                    onClick={handleLogout}
                                >
                                    <LogoutIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </div>

                {/* Avatar with Status */}
                <div className="profile-avatar-wrapper group relative">
                    <div className="relative">
                        <Avatar
                            src={currentAvatarSrc}
                            style={{ width: '120px', height: '120px', border: '6px solid #111214' }}
                        />
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60 transition" style={{ margin: '6px' }}>
                                <label htmlFor="pfp-upload" className="cursor-pointer text-white">
                                    <PhotoCamera />
                                </label>
                                <input id="pfp-upload" type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, 'profilepic')} />
                            </div>
                        )}
                        {!isEditing && (
                            <div className="online-indicator-border">
                                <div className={isOnline ? "online-dot" : "offline-dot"}></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="profile-content">
                    {isEditing ? (
                        <div className="flex flex-col gap-4 mt-4">
                            <TextField
                                label="Display Name"
                                variant="outlined"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                InputProps={{ style: { color: 'white' } }}
                                InputLabelProps={{ style: { color: '#b9bbbe' } }}
                            />
                            <TextField
                                label="About Me"
                                variant="outlined"
                                multiline
                                rows={3}
                                fullWidth
                                value={formData.about}
                                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                InputProps={{ style: { color: 'white' } }}
                                InputLabelProps={{ style: { color: '#b9bbbe' } }}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <Button onClick={() => setIsEditing(false)} style={{ color: 'white' }}>Cancel</Button>
                                <Button
                                    onClick={handleSave}
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="profile-name-section">
                                <span className="profile-username">{targetUser.name}</span>
                            </div>

                            <div className="profile-divider"></div>

                            <div className="profile-section-header">About Me</div>
                            <div className="profile-bio">
                                {targetUser.about || "This user is mysterious and has not written a bio yet."}
                            </div>

                            <div className="profile-divider"></div>

                            <div className="profile-section-header">Member Since</div>
                            <div className="profile-bio">
                                {targetUser.createdAt ? dayjs(targetUser.createdAt).format('MMM D, YYYY') : "Unknown"}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
