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
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { Box } from "@mui/system";
import "./ServerDetails.css";
import CancelIcon from "@mui/icons-material/Cancel";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
dayjs.extend(LocalizedFormat);
const ServerDetails = () => {
  const serverDetails = useSelector((state) => state.serverDetail);
  const userDetail = useSelector((state) => state.userInfo);

  const [data, setdata] = useState(serverDetails.isHome ? [] : []);
const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    if (!serverDetails.isHome) {
      let data = JSON.parse(serverDetails.newState);
      //   console.log('hello',data)
      setdata(data);
    } else {
      let data = JSON.parse(userDetail.newUser);
      // console.log(data);
      if(data.name){
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

  return serverDetails.isHome ? (
    <>
      <Box>
        <Card
          className="bg-red-600"
          sx={{
            maxWidth: "100%",
            boxShadow: "0px 0px !important",
            borderRadius: "0px !important",
          }}
        >
          <CardActionArea
            sx={{ background: "#2F3037" }}
            className="bg-yellow-800"
          >
            {isLoading ? <>
            <Skeleton width={'100%'} variant="circular" animation="wave" >
            <div style={{ paddingTop: '100%' }} />
            </Skeleton>
            </>
            :<>
            <CardMedia
              className="p-8"
              component="img"
              height="140"
              image={data.profilepic ? data.profilepic : ""}
              alt="green iguana"
            />
            </>
            }
            <CardContent className="flex flex-col items-center">
              {isLoading?<>
              {/* <Skeleton width={'100%'} variant="text" animation="wave" /> */}
                <Skeleton animation="wave" variant="text" width="50%" ><Typography>.</Typography> </Skeleton>
                <Skeleton animation="wave" variant="text" width="100%" height={30} ><Typography>.</Typography> </Skeleton>
                <Skeleton animation="wave" height={10} width="80%" />
              
              </>:<>
              
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
              }
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </>
  ) : (
    <>
      <Box>
        <div style={{justifyContent:'center'}} className={`${save?'flex items-center justify-center':''}`}>
          {save?<>
            <div style={{margin:'0'}} className="searchBar-2aylmZ container-2oNtJn medium-2NClDM">
            <input
        name="search"
        className="input-2m5SfJ rounded-md px-2 py-1 outline-none"
          placeholder={data.chatName}
          aria-label="Search"
          // value={searchQuery.search}
          // onChange={(e)=>setSearchQuery({...searchQuery, [e.target.name]:e.target.value})}
        />
        </div>
          
          </>
          :
          data.chatName
          }
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
        </div>
        <List
          className="bg-transparent"
          dense
          sx={{ width: "100%", maxWidth: 360, bgcolor: "transparent" }}
        >
          {data?.users?.map((user, value) => {
            const labelId = `checkbox-list-secondary-label-${value + 1}`;
            return (
              <ListItem
                className="pr-0"
                sx={{ paddingRight: "0px" }}
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
                  <ListItemAvatar                           sx={{objectFit: 'contain', width: '40px', height: '40px'}}
>
                    <Avatar
                      sx={{objectFit: 'contain', width: '40px', height: '40px'}}
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
            // loading
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
