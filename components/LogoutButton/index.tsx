import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const useStyles = makeStyles((theme) => ({
  root: {
    float: 'right',
    paddingBottom: '2em',
    paddingRight: '1em'
  },
  label: {
    color: '#133F5D'
  },
  info: {
    color: '#569AD3'
  },
  menu: {
    padding: '100px'
  },
  logout: {
    color: '#FFFFFF',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  icon: {
    marginRight: '0.3em',
    marginLeft: '0.3em',
    color: '#569AD3',
  }
}));

const LogoutButton = () => {
  const classes = useStyles();
  const cookies = new Cookies();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const [userInfo, setUserInfo] = useState({
    username: '',
    name: '',
    last_login: ''
  })

  useEffect(() => {
    let username =  cookies.get('username'); 
    let name =  cookies.get('name'); 
    let last_login =  cookies.get('last_login'); 
    setUserInfo({
      username,
      name,
      last_login
    })
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    router.push('/logout');
  }

  return (
    <div className={classes.root}>
      <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
        <PersonOutlineIcon className={classes.icon}/>
        <Typography className={classes.info}>
          {userInfo.name}
        </Typography>
        <ArrowDropDownIcon className={classes.icon}/>
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        className={classes.menu}
      >
        <MenuItem>
          <Typography variant="subtitle2" className={classes.label}>Username</Typography>
        </MenuItem>
        <MenuItem>
          <Typography className={classes.info}>{userInfo.username}</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" className={classes.label}>Name</Typography>
        </MenuItem>
        <MenuItem>
          <Typography className={classes.info}>{userInfo.username}</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="subtitle2" className={classes.label}>Last Login</Typography>
        </MenuItem>
        <MenuItem>
          <Typography className={classes.info}>{userInfo.last_login}</Typography>
        </MenuItem>
        <MenuItem>
          <Button onClick={handleLogout} className={classes.logout}>Logout</Button>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default LogoutButton;