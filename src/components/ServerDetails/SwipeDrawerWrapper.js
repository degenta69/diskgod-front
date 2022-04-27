import * as React from "react";
// import Box from '@mui/material/Box';
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';
import ServerDetails from "./ServerDetails";
import SwipeRightAltIcon from "@mui/icons-material/SwipeRightAlt";
import { useDispatch, useSelector } from "react-redux";
import { setmuiModalBool } from "../../state/muiModalState/muiModalState";
import { Backdrop } from "@material-ui/core";

export default function SwipeableTemporaryDrawer({ toggleDrawer, state }) {
  const open = useSelector((state) => state.muiModalShow.value);

  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setmuiModalBool(false));
  };
  const handleOpen = () => {
    dispatch(setmuiModalBool(true));
  };

  return (
    <>
      <SwipeableDrawer
        className="bg-serverBG "
        anchor={"right"}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          width: "0vh",
          
        }}
      >
        <ServerDetails />
      </SwipeableDrawer>
    </>
  );
}
