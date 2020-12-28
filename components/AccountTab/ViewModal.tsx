import React, { useState, useEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';
import axios from 'axios';

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
  }
}));

const ViewModal = (props) => {
  const classes = useStyles();
  const cookies = new Cookies();
  // getModalStyle is not a pure function, we roll the style only on the first render
  // const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState({
    name: "",
    type: "",
    description: ""
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const [account, setAccount] = useState({});

  useEffect(() => {
    if (props.id !== 0)
    {
      let auth = `Bearer ${cookies.get('token')}`;
      axios.get(`/api/finance-accounts/${props.id}`, {
        headers: {
          "Authorization": auth
        }
      }).then((res) => {
        setAccount(res.data);
      })
  }
  }, [])

  const body = (
    <div className={classes.paper}>
      <Typography className={classes.title} variant='h5'>View Account</Typography>
      <Typography variant='subtitle2' className={classes.label}>Account Name</Typography>
      <Typography className={classes.text}>{account.name}</Typography>
      <Typography variant='subtitle2' className={classes.label}>Type</Typography>
      <Typography className={classes.text}>{account.type}</Typography>
      <Typography variant='subtitle2' className={classes.label}>Description</Typography>
      <Typography className={classes.text}>{account.description}</Typography>
    </div>
  );

  return (
    <div>
      <Button onClick={handleOpen}>
        <Typography className={classes.action}>View</Typography>
      </Button>
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

export default ViewModal
