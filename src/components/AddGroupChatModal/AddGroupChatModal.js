import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { setModalBool } from "../../state/counter/modalShowSlice";
import FileInput from "../../SVG/FileInput";
import {
  Avatar,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import instance from "../../api/axios";
import uploadImageToCloud from "../../utils/uploadImageToCloud";
import { addRerender } from "../../state/serverDetailData/serverDetailSlice";
import AlertModal from "../AlertModal/AlertModal";
import { ApiRequestHandler } from "../../api/apiRepository";
import UrlPaths from "../../Models/UrlPaths";
import ApiMethods from "../../Models/ApiMethods";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  //   border: '2px solid #000',
  borderRadius: "8px",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

export default function AddGroupChatModal() {
  const [searchQuery, setSearchQuery] = React.useState({ search: "" });
  const [searchResult, setSearchResult] = React.useState([]);
  const [groupinfo, setgroupinfo] = React.useState({
    Image: "",
    chatName: "",
    image_secure_url: "",
  });
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState({ status: "", msg: "" });
  const GetUsers = async () => {
    const successCb = (res) => {
      setSearchResult(res.data)
    }
    const errorCb = (error) => {
      setOpenAlert(true);
      setAlertMsg({
        status: "error",
        msg: error.data
          ? error.data.message
            ? error.data.message
            : error.data
          : "Something went wrong",
      });
    }

    await ApiRequestHandler(
      UrlPaths.SEARCH_USER.replace("?queryData", searchQuery.search ?? ""),
      ApiMethods.GET,
      null,
      successCb,
      errorCb
    )
  }
  React.useEffect(() => {
    (async () => await GetUsers())();
    return () => {
      //  setIsLoading(true)
      setSearchResult([]);
    };
  }, [searchQuery]);

  const open = useSelector((state) => state.modalShow.value);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setModalBool(false));
  };

  const [page, setpage] = React.useState({ current: false, next: false });

  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.reduce((acc, curr, index) => {
      if (curr._id === value._id) {
        acc.push(index);
      }
      return acc;
    }, []);

    const newChecked = [...checked];

    if (currentIndex.length === 0) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    // console.log(currentIndex, 'new', newChecked)

    setChecked(newChecked);
  };

  const handleDelete = (index) => {
    const currentIndex = checked.findIndex((curr) => curr._id === index);
    const newChecked = [...checked];
    newChecked.splice(currentIndex, 1);
    setChecked(newChecked);
  };

  const handleMakeGroupChat = async () => {
    let users = checked.map((user) => user._id);
    const data = {
      users: users,
      chatName: groupinfo.chatName,
      Image: groupinfo.image_secure_url ? groupinfo.image_secure_url : "",
    };
    let successCb = (res) => {
      console.log(res);
      setOpenAlert(true);
      setAlertMsg({
        status: "success",
        msg: "Group Chat Created Successfully",
      });

      dispatch(addRerender({}));
    };
    let errorCb = (error) => {
      console.log(error);
      setOpenAlert(true);
      setAlertMsg({
        status: "error",
        msg: error.data
          ? error.data.message
            ? error.data.message
            : error.data
          : "Something went wrong",
      });
    };
    await ApiRequestHandler(
      UrlPaths.GROUP_CHAT,
      ApiMethods.POST,
      data,
      successCb,
      errorCb
    );
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <>
          <Fade in={open} exit={page.next}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                sx={{ textAlign: "center" }}
                variant="h6"
                component="h2"
              >
                Customize your group chat
              </Typography>
              <Typography
                color={"Background.secondary"}
                className={`leading-5 mt-12 text-center`}
                id="transition-modal-description"
                sx={{ mt: 2, fontSize: "12px" }}
              >
                Give your new server a personality with a name and an icon. You
                can always change it later.
              </Typography>
              <Box className="relative flex my-6">
                <FileInput />
                <input
                  type="file"
                  onChange={(e) => {
                    setgroupinfo({ ...groupinfo, Image: e.target.files[0] });
                  }}
                  id="groupChatIconInput"
                  style={{
                    right: 0,
                    opacity: 0,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  className="absolute mx-auto opacity-0 top-0 right-0"
                />
              </Box>
              <Box>
                <TextField
                  helperText={``}
                  className="w-full hover:border-0"
                  onChange={(e) => {
                    setgroupinfo({ ...groupinfo, chatName: e.target.value });
                  }}
                  sx={{
                    backgroundColor: "#E2E4E8",

                    "& .Mui-focused": { outline: 0, border: 0 },
                  }}
                  id="outlined-basic"
                  label="Group Chat's Name"
                  variant="outlined"
                />
                <p
                  className="text-xs text-gray-600 mt-2"
                  style={{ fontSize: "10px" }}
                >
                  By creating a server, you agree to Discord's{" "}
                  <strong className="text-blue-600">
                    community guidelines
                  </strong>
                </p>
              </Box>
              <Box className="flex mt-4 justify-end">
                <button
                  onClick={async () => {
                    setpage({ current: !page.current, next: !page.next });
                    const url = await uploadImageToCloud(groupinfo.Image);
                    setgroupinfo({ ...groupinfo, image_secure_url: url });
                  }}
                  style={{
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    marginTop: "1rem",
                    transition: "all 0.3s ease-in-out",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 transition-all ease-in-out duration-500 rounded-lg"
                >
                  next
                </button>
              </Box>
            </Box>
          </Fade>
          <Fade in={page.next} exit={page.current}>
            <Box sx={style}>
              <Box>
                <Box>
                  {checked.map((item, index) => {
                    return (
                      <Chip
                        color="success"
                        size="small"
                        label={item.name}
                        onDelete={() => {
                          handleDelete(item._id);
                        }}
                        avatar={<Avatar src={item.profilepic} />}
                      />
                    );
                  })}
                </Box>
                <TextField
                  helperText={``}
                  name="search"
                  onChange={(e) =>
                    setSearchQuery({
                      ...searchQuery,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="w-full hover:border-0"
                  sx={{
                    backgroundColor: "#E2E4E8",

                    "& .Mui-focused": { outline: 0, border: 0 },
                  }}
                  id="outlined-basic"
                  label="Search your Friend's Name"
                  variant="outlined"
                />
                {/* <p
                  className="text-xs text-gray-600 mt-2"
                  style={{ fontSize: "10px" }}
                >
                  By creating a server, you agree to Discord's{" "}
                  <strong className="text-blue-600">
                    community guidelines
                  </strong>
                </p> */}
              </Box>
              <List
                className="hideScrollbar"
                dense
                sx={{
                  width: "100%",
                  height: "20em",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  overflow: "scroll",
                }}
              >
                {searchResult.map((value, i) => {
                  const labelId = `checkbox-list-secondary-label-${value}`;
                  return (
                    <ListItem
                      key={`${value}-${value._id}`}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(value)}
                          checked={
                            checked.findIndex((obj) => {
                              return obj._id === value._id;
                            }) !== -1
                          }
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      }
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              objectFit: "contain",
                              width: "40px",
                              height: "40px",
                            }}
                            alt={`Avatar n°${value + 1}`}
                            src={value.profilepic}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          id={`${labelId}-${value._id}`}
                          primary={value.name}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
              <Box className="flex mt-4 justify-between">
                <button
                  onClick={() => {
                    setpage({ current: !page.current, next: !page.next });
                  }}
                  style={{
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    marginTop: "1rem",
                    transition: "all 0.3s ease-in-out",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-md"
                >
                  prev
                </button>
                <button
                  onClick={handleMakeGroupChat}
                  style={{
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    marginTop: "1rem",
                    transition: "all 0.3s ease-in-out",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-md"
                >
                  Make a Group Chat
                </button>
                <AlertModal
                  open={openAlert}
                  setOpen={setOpenAlert}
                  msg={alertMsg}
                />
              </Box>
            </Box>
          </Fade>
        </>
      </Modal>
    </div>
  );
}
