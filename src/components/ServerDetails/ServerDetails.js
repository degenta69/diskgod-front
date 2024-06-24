import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import FilledInput from '@mui/material/FilledInput';
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { Box } from "@mui/system";
import "./ServerDetails.css";
import CancelIcon from "@mui/icons-material/Cancel";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { useMediaQuery } from "react-responsive";
import { isUserGroupAdmin } from "../../utils/isUserGroupAdmin";
import instance from "../../axios";
import axios from "axios";
import uploadImageToCloud from "../../utils/uploadImageToCloud";
import { setmuiModalBool } from "../../state/muiModalState/muiModalState";
dayjs.extend(LocalizedFormat);
const ServerDetails = () => {
  const serverDetails = useSelector((state) => state.serverDetail);
  const userDetail = useSelector((state) => state.userInfo);

  const [data, setdata] = useState([]);
  const [user, setuser] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [editValues, setEditValues] = useState({
    chatName: "",
    banner: "",
  });
  useEffect(() => {
    if (!serverDetails.isHome) {
      let data = JSON.parse(serverDetails.newState);
      let userdata = JSON.parse(userDetail.newUser);
      setuser(userdata);
      //   console.log('hello',data)
      setdata(data);
    } else {
      let data = JSON.parse(userDetail.newUser);
      console.log("hello", data);
      // console.log(data);
      if (data.id) {
        setisLoading(false);
      }
      setdata(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverDetails]);

  const [checked, setChecked] = React.useState([]);
  const [save, setsave] = useState(false);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const dispatch = useDispatch();
  const handleUpdateChatDetails = async () => {
    setisLoading(false);
    if(editValues.banner){
      var url = await uploadImageToCloud(editValues.banner);
    }
    if(editValues.Image){
      var imageurl = await uploadImageToCloud(editValues.Image);
    }
    let resBodyData = {
      chatName: editValues.chatName,
      banner: url,
      chatId: data._id,
      Image: imageurl,
    };
    console.log(editValues, "editValues", resBodyData, "resBodyData");
    
    try {
      const res = await instance.put("/api/chats/group/rename", resBodyData);
      dispatch(setmuiModalBool(false))
      window.location.reload();
      setisLoading(false);
    } catch (error) {
      console.log(error);
      setisLoading(false);
    }
  };

  return serverDetails.isHome ? (
    <>
      <Box
        className=""
        sx={{ width: isMobile ? "100vw" : "30vw", height: "100%" }}
      >
        <Card
          className="bg-red-600"
          sx={{
            maxWidth: "100%",
            boxShadow: "0px 0px !important",
            borderRadius: "0px !important",
            height: "100%",
          }}
        >
          <CardActionArea
            sx={{ background: "#2F3037", height: "100%" }}
            className="bg-yellow-800"
          >
            {isLoading ? (
              <>
                <Skeleton width={"100%"} variant="circular" animation="wave">
                  <div style={{ paddingTop: "100%" }} />
                </Skeleton>
              </>
            ) : (
              <>
                <CardMedia
                  className="p-8"
                  component="img"
                  height="140"
                  image={data.profilepic ? data.profilepic : ""}
                  alt="green iguana"
                />
              </>
            )}
            <CardContent className="flex flex-col items-center">
              {isLoading ? (
                <>
                  {/* <Skeleton width={'100%'} variant="text" animation="wave" /> */}
                  <Skeleton animation="wave" variant="text" width="50%">
                    <Typography>.</Typography>{" "}
                  </Skeleton>
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width="100%"
                    height={30}
                  >
                    <Typography>.</Typography>{" "}
                  </Skeleton>
                  <Skeleton animation="wave" height={10} width="80%" />
                </>
              ) : (
                <>
                  <Typography
                    gutterBottom
                    className="text-white"
                    variant="h5"
                    component="div"
                  >
                    {data.name}
                  </Typography>
                  <Typography variant="body2" color="GrayText">
                    {data.email}
                  </Typography>
                  <Typography variant="body2" color="GrayText">
                    {dayjs(data.dob).format("LLLL")}
                  </Typography>
                </>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </>
  ) : (
    <>
      <Box
        className="bg-serverBG text-center serverDetailWrapper"
        sx={{ width: isMobile ? "100vw" : "40vw", height: "100%" }}
      >
        {console.log(data)}
        <div
          style={{
            background: !(data.banner === '')?`url(${data?.banner}) center center / cover no-repeat`:'',
            opacity: save ? "0.3" : "1",
          }}
          className="chat-banner-div"
        >
          {save && (
            <>
              <div
                onClick={() => {
                  document.getElementById("chat-banner-file-input").click();
                }}
                className="save-icon-div"
              >
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="chat-banner-file-input"
                  onChange={(e) => {
                    setEditValues({ ...editValues, banner: e.target.files[0] });
                  }}
                />

                <svg
                  className="circleIcon-3489FI"
                  aria-hidden="false"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"
                  ></path>
                </svg>
              </div>
            </>
          )}
        </div>

        <div
          style={{ justifyContent: "center" }}
          className={`${
            save ? "flex items-center justify-center" : ""
          } chat-name-edit-icon-wrapper`}
        >
          <Box sx={{display:'flex', 
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          gap:'1rem'
          }}>
          <div
        style={{
          background: !(data.Image === '')?`url(${data?.Image}) center center / cover no-repeat`:'',
          opacity: save ? "0.3" : "1",
          borderRadius:'50%',
          width:'35px',
          height:'35px',
        }}
        >
          {save && (
            <>
              <div
                onClick={() => {
                  document.getElementById("chat-image-file-input").click();
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                }}
              >
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="chat-image-file-input"
                  onChange={(e) => {
                    setEditValues({ ...editValues, Image: e.target.files[0] });
                  }}
                />

                <svg
                style={{
                  margin: "auto",
                }}
                  className="circleIcon-3489FI"
                  aria-hidden="false"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"
                  ></path>
                </svg>
              </div>
            </>
          )}
        </div>
          {save ? (
            <>
              <div
                style={{ margin: "0" }}
                className="searchBar-2aylmZ container-2oNtJn medium-2NClDM"
              >
                <input
                  name="chatName"
                  onChange={(e) => {
                    setEditValues({ ...editValues, chatName: e.target.value });
                  }}
                  className="input-2m5SfJ rounded-md px-2 py-1 outline-none"
                  placeholder={data.chatName}
                  aria-label="Search"
                  // value={searchQuery.search}
                  // onChange={(e)=>setSearchQuery({...searchQuery, [e.target.name]:e.target.value})}
                />
              </div>
            </>
          ) : (
            <>
            <Typography
              className="chatName-heading"
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              {data.chatName}
            </Typography>
          </>
          )}
          </Box>
          {isUserGroupAdmin(data, user) ? (
            <Checkbox
              edge="end"
              size="small"
              icon={<EditOutlinedIcon />}
              checkedIcon={<EditRoundedIcon />}
              onChange={() => {
                setsave(!save);
              }}
              checked={save}
              inputProps={{ "aria-labelledby": "checkbox-label" }}
            />
          ) : (
            ""
          )}
        </div>
        <List
          className="bg-transparent"
          dense
          sx={{ width: "100%", maxWidth: "none", bgcolor: "transparent",maxHeight:'50vh',overflow:'scroll'  }}
        >
          {data?.users?.map((user, value) => {
            const labelId = `checkbox-list-secondary-label-${value + 1}`;
            return (
              <ListItem
                className="pr-0"
                sx={{ paddingRight: "0px"}}
                key={value}
                secondaryAction={
                  save ? (
                    <Checkbox
                      edge="end"
                      size="small"
                      icon={<CancelOutlinedIcon />}
                      checkedIcon={<CancelIcon />}
                      onChange={handleToggle(user._id.toString())}
                      checked={checked.indexOf(user._id.toString()) !== -1}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  ) : (
                    ""
                  )
                }
                disablePadding
              >
                <ListItemButton
                  sx={{ paddingRight: "0px" }}
                  className="buttonAvater"
                >
                  <ListItemAvatar
                    sx={{ objectFit: "contain", width: "40px", height: "40px" }}
                  >
                    <Avatar
                      sx={{
                        objectFit: "contain",
                        width: "40px",
                        height: "40px",
                      }}
                      alt={`Avatar n°${value + 1}`}
                      src={user.profilepic}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    sx={{ fontWeight: 800 }}
                    primary={user.name}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        {save ? (
          <LoadingButton
            onClick={handleUpdateChatDetails}
            loading={false}
            color="success"
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            disableElevation
            width="100%"
          >
            Save
          </LoadingButton>
        ) : (
          ""
        )}
      </Box>
    </>
  );
};

export default ServerDetails;
