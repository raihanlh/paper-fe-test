import React, { useState, useEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
    color: theme.palette.primary.main
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const CreateTransaction = (props) => {
  const classes = useStyles();
  const cookies = new Cookies();
  const [open, setOpen] = useState(false);

  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    setAccounts(props.accounts.filter((account) => {
      return !account.deleted_at
    }))
    console.log(props.accounts[0].id);
  }, [])

  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [accountId, setAccountId] = useState(props.accounts[0].id);
  console.log(props.accounts[0].id);
  console.log("accountId:" + accountId);
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  }
  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(e.currentTarget.value));
  }
  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.currentTarget.value);
  }
  const onChangeAccountId = (e: React.ChangeEvent<{ value: unknown }>) => {
    console.log("onChangeAccountId" + e.currentTarget.value);
    setAccountId(e.currentTarget.value as int);
  }
  
  const handleSave = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log(title);
    console.log(amount);
    console.log(description);
    console.log(accountId);
    console.log(props.accounts[0].id);

    let auth = `Bearer ${cookies.get('token')}`;
    axios.post('/api/finances', 
    {
      title, 
      debit_amount: amount, 
      credit_amount: amount, 
      description,
      finance_account_id: accountId
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

  const accountList = props.accounts.map((account, index) => {
    console.log("account id: " + account.id);
    return (
      account.deleted_at ? null :
      (<MenuItem value={account.id} className={classes.action} key={index}>
       {`${account.id} ${account.name}`}
      </MenuItem>)
    )
  });

  const body = (
    <div className={classes.paper}>
      <Typography className={classes.title} variant='h5'>Create Transaction</Typography>
      <TextField id="transaction-title" label="Title" className={classes.text} 
        InputLabelProps={{ style: { color: '#000000' }}}
        onChange={onChangeTitle}/>
      <TextField id="transaction-amount" label="Amount" className={classes.text}
        InputLabelProps={{ style: { color: '#000000' }}}
        onChange={onChangeAmount}
        type="number"/>
      <TextField id="transaction-description" label="Description" className={classes.text}
        InputLabelProps={{ style: { color: '#000000' }}}
        onChange={onChangeDescription}/>
      <Box>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label" style={{ color: '#000000' }}>Account</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={accountId}
            onChange={onChangeAccountId}
            onBlur={undefined}
          >
            <MenuItem value={0} className={classes.action}>
              None
            </MenuItem>
            {accountList}
          </Select>
        </FormControl>
      </Box>
      <Box>
        <Button onClick={handleSave} className={classes.btn}>Save</Button>
      </Box>
    </div>
  );

  return (
    <div>
      <Button onClick={handleOpen} className={classes.btn}>Create New Transaction</Button>
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

export default CreateTransaction;
