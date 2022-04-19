import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Zoom from '@mui/material/Zoom';
import HashtagSvg from '../../SVG/HashtagSvg';
import { useSelector } from 'react-redux';

export default function ServerNavbar({ isHome, serverDetail }) {
  var userDetail = useSelector((state) => state.userInfo.newUser);
  userDetail = JSON.parse(userDetail)
  // React.useEffect(() => {
  // }, []);

  // console.log(userDetail, 'userDetail', serverDetail, 'serverDetail');
  return isHome? (
    <React.Fragment>
      {/* <CssBaseline /> */}
      <AppBar sx={{left:"inherit",right:'inherit', top:"inherit",backgroundColor:'inherit'}}>
        <Toolbar >
          <Typography sx={{display:'flex',alignItems: 'center',gap:'0.5rem'}} variant="h6" component="div">
            <HashtagSvg color='#8F9296'/>
            {userDetail?.name}
          </Typography>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  ):(
    <React.Fragment>
      {/* <CssBaseline /> */}
      <AppBar sx={{left:"inherit",right:'inherit', top:"inherit",backgroundColor:'inherit'}}>
        <Toolbar>
          <Typography sx={{display:'flex',alignItems: 'center',gap:'0.5rem'}} variant="h6" component="div">
            <HashtagSvg color='#8F9296'/>
            {serverDetail?.chatName}
          </Typography>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}
