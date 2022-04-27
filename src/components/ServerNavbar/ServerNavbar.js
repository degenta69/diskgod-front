import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import HashtagSvg from "../../SVG/HashtagSvg";
import { useDispatch, useSelector } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import { setmuiOpen } from "../../state/muiModalState/muiModalState";
export default function ServerNavbar({ isHome, serverDetail, toggleDrawer }) {
  var userDetail = useSelector((state) => state.userInfo.newUser);
  userDetail = JSON.parse(userDetail);
  const dispatch = useDispatch();
  // React.useEffect(() => {
  // }, []);

  // console.log(userDetail, 'userDetail', serverDetail, 'serverDetail');
  return isHome ? (
    <React.Fragment>
      {/* <CssBaseline /> */}
      <AppBar
        sx={{
          left: "inherit",
          right: "inherit",
          position: "relative",
          height: "7vh",
          top: "inherit",
          backgroundColor: "inherit",
        }}
      >
        <Toolbar>
          <Typography
            sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            variant="h6"
            component="div"
          >
            <HashtagSvg color="#8F9296" />
            {userDetail?.name}
          </Typography>
          <InfoIcon
            sx={{
              fill: "#8F9296",
              cursor: "pointer",
              marginLeft: "auto",
              "&:hover": {
                fill: "#bec1c5",
              },
            }}
            onClick={() => {
              dispatch(setmuiOpen())
            }}
          />
        </Toolbar>
      </AppBar>
    </React.Fragment>
  ) : (
    <React.Fragment>
      {/* <CssBaseline /> */}
      <AppBar
        sx={{
          left: "inherit",
          right: "inherit",
          position: "relative",
          height: "7vh",
          top: "inherit",
          backgroundColor: "inherit",
        }}
      >
        <Toolbar>
          <Typography
            sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            variant="h6"
            component="div"
          >
            <HashtagSvg color="#8F9296" />
            {serverDetail?.chatName}
          </Typography>
          <InfoIcon
            sx={{
              fill: "#8F9296",
              cursor: "pointer",
              marginLeft: "auto",
              "&:hover": {
                fill: "#bec1c5",
              },
            }}
            onClick={() => {
              dispatch(setmuiOpen())
            }}
          />
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
