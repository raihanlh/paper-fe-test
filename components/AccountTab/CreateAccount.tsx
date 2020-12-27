import React, { useState, useEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';
import axios from 'axios';
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
  },
  action: {
    color: '#000000'
  },
  title: {
    color: theme.palette.primary.main,
    marginBottom: '1em'
  },
  label: {
    color: theme.palette.primary.main,
    fontWeight: 'bold'
  },
  text: {
    color: theme.palette.primary.main,
    marginBottom: '0.7em'
  },
  btn: {
    float: 'right',
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF'
  }
}));

const CreateAccount = () => {
  const classes = useStyles();
  const cookies = new Cookies();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }
  const onChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.currentTarget.value)
  }
  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.currentTarget.value)
  }
  const handleSave = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log(name);
    console.log(type);
    console.log(description);

    let auth = `Bearer ${cookies.get('token')}`;
    axios.post('/api/finance-accounts', 
    {
      name, 
      type, 
      description
    }, 
    {
      headers: {
        "Authorization": auth
      }
    })

    setOpen(false);
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div className={classes.paper}>
      <Typography className={classes.title} variant='h5'>Create Account</Typography>
      <TextField id="account-name" label="Name" className={classes.text} 
        InputLabelProps={{ style: { color: '#000000' }}}
        onChange={onChangeName}/>
      <TextField id="account-type" label="Type" className={classes.text}
        InputLabelProps={{ style: { color: '#000000' }}}
        onChange={onChangeType}/>
      <TextField id="account-description" label="Description" className={classes.text}
        InputLabelProps={{ style: { color: '#000000' }}}
        onChange={onChangeDescription}/>
      <Box>
        <Button onClick={handleSave} className={classes.btn}>Save</Button>
      </Box>
    </div>
  );

  return (
    <div>
      <Button onClick={handleOpen} className={classes.btn}>Create New Account</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  )
}

export default CreateAccount
