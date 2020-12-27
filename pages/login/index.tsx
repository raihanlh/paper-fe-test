import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router'
import axios from 'axios';
import Cookies from 'universal-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundColor: '#3B7FBA',
    color: '#FFFFFF',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: '#FFFFFF',
    backgroundColor: '#AFE47C'
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `${theme.palette.primary.main} !important`,
    }
  },
  cssFocused: {},
  notchedOutline: {
    borderWidth: '1px',
    borderColor: 'green !important'
  },
}));

const LoginTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  },
})(TextField);

export default function Login() {
  const router = useRouter();
  const cookies = new Cookies();

  useEffect(() => {
    let token = cookies.get('token');
    if (token) {
      router.push('/finance');
    }
  }, [])

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value)
  }
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value)
  }
  const classes = useStyles();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(username);
    console.log(password);
    axios.post('/api/login', {username, password})
      .then((res) => 
      {
        if (res.status === 200) {
        console.log(res.data);
        cookies.set('token', res.data.token, {
          path: '/',
          expires: new Date(Date.now() + 3000 * 1000)
        })
        cookies.set('username', username, {
          path: '/',
          expires: new Date(Date.now() + 3000 * 1000)
        })
        cookies.set('name', res.data.name, {
          path: '/',
          expires: new Date(Date.now() + 3000 * 1000)
        })
        cookies.set('last_login', res.data.last_login, {
          path: '/',
          expires: new Date(Date.now() + 3000 * 1000)
        })
        router.push('/');
      }});
    // router.push('/');
  }

  return (
    <Grid container component="main" className={classes.root}>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square className={classes.root}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Masuk ke Paper.id
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <LoginTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              inputProps={{
                classes: {
                  root: classes.cssOutlinedInput,
                  focused: classes.cssFocused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              onChange={onChangeUsername}
              />
            <LoginTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onChangePassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              // color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Grid>
      <Grid item xs={false} sm={4} md={7} />
    </Grid>
  );
}