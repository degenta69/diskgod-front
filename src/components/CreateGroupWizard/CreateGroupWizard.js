import React, { useState } from 'react';
import {
    Box,
    Modal,
    Fade,
    Typography,
    TextField,
    Avatar,
    Chip,
    IconButton,
    InputAdornment,
    Backdrop
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setModalBool } from '../../state/counter/modalShowSlice';
import uploadImageToCloud from '../../utils/uploadImageToCloud';
import { ApiRequestHandler } from '../../api/apiRepository';
import UrlPaths from '../../Models/UrlPaths';
import ApiMethods from '../../Models/ApiMethods';
import { addRerender } from '../../state/serverDetailData/serverDetailSlice';
import UserSelectionList from './UserSelectionList';

// Glass Styles
const GlassCard = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    background: 'rgba(15, 23, 42, 0.85)', // Dark Slate Glass
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    padding: '32px',
    color: 'white',
    outline: 'none',
    [theme.breakpoints.down('sm')]: {
        width: '90%',
        padding: '24px'
    }
}));

const NeonButton = styled('button')(({ theme, variant }) => ({
    background: variant === 'secondary' ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #00ffff 0%, #0099ff 100%)',
    color: variant === 'secondary' ? '#fff' : '#000',
    fontWeight: 'bold',
    padding: '12px 24px',
    borderRadius: '12px',
    border: variant === 'secondary' ? '1px solid rgba(255,255,255,0.1)' : 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: variant === 'secondary' ? 'none' : '0 0 15px rgba(0, 255, 255, 0.5)',
        background: variant === 'secondary' ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #00ffff 0%, #0099ff 100%)',
    }
}));

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        color: 'white',
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
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255,255,255,0.5)',
        '&.Mui-focused': {
            color: '#00ffff',
        },
    },
});

const CreateGroupWizard = () => {
    const dispatch = useDispatch();
    const open = useSelector((state) => state.modalShow.value);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [groupInfo, setGroupInfo] = useState({
        name: '',
        description: '',
        image: null,
        imageUrl: '',
        banner: null
    });

    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleClose = () => {
        dispatch(setModalBool(false));
        setStep(1);
        setGroupInfo({ name: '', description: '', image: null, imageUrl: '', banner: null });
        setSelectedUsers([]);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGroupInfo({
                ...groupInfo,
                image: file,
                imageUrl: URL.createObjectURL(file)
            });
        }
    };

    const createGroup = async () => {
        setLoading(true);
        try {
            let uploadedImageUrl = groupInfo.imageUrl; // Default if string

            // Upload actual file if present
            if (groupInfo.image instanceof File) {
                const cloudUrl = await uploadImageToCloud(groupInfo.image);
                if (cloudUrl) uploadedImageUrl = cloudUrl;
            }

            const payload = {
                chatName: groupInfo.name,
                description: groupInfo.description,
                users: selectedUsers.map(u => u._id),
                Image: uploadedImageUrl,
                banner: '' // Banner support can be added similarly
            };

            await ApiRequestHandler(
                UrlPaths.GROUP_CHAT,
                ApiMethods.POST,
                payload,
                (res) => {
                    // Success
                    dispatch(addRerender({}));
                    handleClose();
                },
                (err) => {
                    console.error("Group creation failed", err);
                    // Handle error toast here
                }
            );
        } catch (error) {
            console.error("Error creating group", error);
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <Fade in={step === 1}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#fff' }}>
                    Create Your Realm
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
                    Give your new group a personality with a name and an icon.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="icon-button-file"
                        type="file"
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="icon-button-file">
                        <IconButton color="primary" aria-label="upload picture" component="span"
                            sx={{
                                width: 100,
                                height: 100,
                                border: '2px dashed rgba(255,255,255,0.3)',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                '&:hover': { borderColor: '#00ffff' }
                            }}
                        >
                            {groupInfo.imageUrl ? (
                                <img src={groupInfo.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>UPLOAD</Typography>
                            )}
                        </IconButton>
                    </label>
                </Box>

                <StyledTextField
                    fullWidth
                    label="Server Name"
                    variant="outlined"
                    value={groupInfo.name}
                    onChange={(e) => setGroupInfo({ ...groupInfo, name: e.target.value })}
                    sx={{ mb: 3 }}
                />

                <StyledTextField
                    fullWidth
                    label="Description (Optional)"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={groupInfo.description}
                    onChange={(e) => setGroupInfo({ ...groupInfo, description: e.target.value })}
                    sx={{ mb: 4 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <NeonButton variant="secondary" onClick={handleClose}>Cancel</NeonButton>
                    <NeonButton onClick={() => setStep(2)} disabled={!groupInfo.name}>Next</NeonButton>
                </Box>
            </Box>
        </Fade>
    );

    const renderStep2 = () => (
        <Fade in={step === 2}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#fff' }}>
                    Summon Allies
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                    Invite friends to join {groupInfo.name}.
                </Typography>

                {/* User Selection Component */}
                <Box sx={{ height: 300, overflow: 'hidden', mb: 3 }}>
                    <UserSelectionList
                        selectedUsers={selectedUsers}
                        setSelectedUsers={setSelectedUsers}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <NeonButton variant="secondary" onClick={() => setStep(1)}>Back</NeonButton>
                    <NeonButton onClick={createGroup} disabled={selectedUsers.length === 0 || loading}>
                        {loading ? "Creating..." : "Create Server"}
                    </NeonButton>
                </Box>
            </Box>
        </Fade>
    );

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500, sx: { background: 'rgba(0,0,0,0.8)' } }}
        >
            <GlassCard>
                {step === 1 ? renderStep1() : renderStep2()}
            </GlassCard>
        </Modal>
    );
};

export default CreateGroupWizard;
