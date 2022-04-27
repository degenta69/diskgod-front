import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { Skeleton, Tooltip } from "@mui/material";
import { Stack } from "@mui/material";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from "@mui/system";
import instance from "../../axios";
import { useDispatch } from "react-redux";
import { addRerender } from "../../state/serverDetailData/serverDetailSlice";

export default function UserList({ data, loading }) {
  React.useEffect(() => {
    // console.log(loading)
  }, [loading]);
const dispatch = useDispatch();

const getElementByIdAsync = id => new Promise(resolve => {
  const getElement = () => {
    const element = document.getElementById(id);
    if(element) {
      resolve(element);
    } else {
      requestAnimationFrame(getElement);
    }
  };
  getElement();
});

  const handleMakeChat = async (user) => {
      const getUserChat = await instance.post("api/chats",{userId:user})
      const serverDataId = await getUserChat.data[0]?._id?getUserChat.data[0]?._id:getUserChat.data?._id
      getElementByIdAsync(`serverData${serverDataId}`).then(element => {
        element.click();
        // console.log(element)
      }).catch(err => console.log(err));
      // if(document.getElementById(`serverData${serverDataId}`)){
      //   document.getElementById(`serverData${serverDataId}`).click()
      // }else{
      // }
      dispatch(addRerender({}))
      
      
      // console.log('chatdeails',getUserChat.data[0]?._id?getUserChat.data[0]?._id:getUserChat.data?._id,'serverData',serverDataId, 'e;ement',document.getElementById(`serverData${serverDataId}`))
    // console.log(user);
    };

  return (
    <Box sx={{height:'calc(100% - 12%)'}} className='overflow-scroll h-screen hideScrollbar'>
    <List className="overflow-x-auto hideScrollbar" sx={{ width: "100%",bgcolor: "transparent" }}>
      {data?.map((user, index) => {
        return (
          <React.Fragment key={`frag-${user.id}-${index}`} >
            <ListItem
              key={`listitem-${user._id}-${index}`}
              sx={{ paddingRight: "0px", overflow: "hidden" }}
              alignItems="center"
            >
              <ListItemAvatar>
                {loading ? (
                  <Skeleton animation="pulse" variant="circular">
                    <Avatar />
                  </Skeleton>
                ) : (
                  <Avatar alt={user.name} src={user.profilepic} />
                )}
              </ListItemAvatar>
              {!loading ? (
                <ListItemText
                  sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#fff" }}
                  primary={user.name}
                  secondary={
                    < >
                      <Typography
                        sx={{ fontWeight: 600, display: "inline" }}
                        component="span"
                        variant="body2"
                        color="white"
                        >
                        {user.email}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          display: "inline",
                          whiteSpace: "nowrap",
                        }}
                        color={"GrayText"}
                      >
                        {` — This Account was created ${moment
                          .utc(user.createdAt)
                          .local()
                          .startOf("seconds")
                          .fromNow()}`}
                      </Typography>
                    </>
                  }
                  />
              ) : (
                <>
                  <Stack width="100%">
                    <Skeleton animation="pulse" variant="text" width="100%">
                      <Typography variant="h5">.</Typography>
                    </Skeleton>
                    <Skeleton animation="pulse" variant="text" width="100%">
                      <Typography variant="body">.</Typography>
                    </Skeleton>
                  </Stack>
                </>
              )}
              <Box className="flex gap-2" >

               {loading?<>
                <Skeleton sx={{width: 24, height: 24}} animation="pulse" variant="circular">
                    <Avatar />
                  </Skeleton>
                  <Skeleton sx={{width: 24, height: 24}} animation="pulse" variant="circular">
                    <Avatar />
                  </Skeleton>
               </>:
               <>
               <Tooltip arrow title="Send Message">
                <Avatar onClick={()=>{handleMakeChat(user._id)}} sx={{bgcolor:'#212224',width: 24, height: 24}} >
               <ChatBubbleIcon sx={{ width: 12, height: 12 }} />
                </Avatar>
                </Tooltip>
                <Tooltip arrow title="View Profile">
                <Avatar sx={{bgcolor:'#212224',width: 24, height: 24}} >
               <MoreVertIcon sx={{ width: 12, height: 12 }} />
                </Avatar>
                </Tooltip>
               </>
              }
              </Box>
            </ListItem>
            <Divider key={`divider-${user._id}-${index}`} variant="inset" component="li" />
          </React.Fragment>
        );
      })}
    </List>
    </Box>
  );
}
