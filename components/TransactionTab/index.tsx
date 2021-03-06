import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import ViewTransaction from './ViewTransaction';
// import EditModal from '../AccountTab/EditModal';
import DeleteTransaction from './DeleteTransaction';
import CreateTransaction from './CreateTransaction';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  btnAction: {
    backgroundColor: '#85d15c',
    color: '#FFFFFF',
    '&:hover': {
      color: '#85d15c'
    }
  },
  action: {
    color: '#000000'
  },
  btnRefresh: {
    float: 'right'
  },
  center: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'center',
  }
}))

const TransactionTab = () => {
  const cookies = new Cookies();
  const classes = useStyles();
  const [finances, setFinances] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    let auth = `Bearer ${cookies.get('token')}`;
    axios.get('/api/finance-accounts', {
      headers: {
        "Authorization": auth
      }
    }).then((res) => {
      console.log(res.data.data)
      setAccounts(res.data.data);
      setLoading(false);
      console.log(accounts);
      axios.get('/api/finances', {
        headers: {
          "Authorization": auth
        }
      }).then((res) => {
        console.log(res.data.data)
        setFinances(res.data.data);
        setLoading(false);
        console.log(finances);
      })
    })
  }, [])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [loading, setLoading] = useState<boolean>(true);

  const handleClick = (id: number) => (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);
    let auth = `Bearer ${cookies.get('token')}`;
    axios.get('/api/finance-accounts', {
      headers: {
        "Authorization": auth
      }
    }).then((res) => {
      console.log(res.data.data)
      setAccounts(res.data.data);
      setLoading(false);
      axios.get('/api/finances', {
        headers: {
          "Authorization": auth
        }
      }).then((res) => {
        console.log(res.data.data)
        setFinances(res.data.data);
        setLoading(false);
        console.log(finances);
      });
    });
  }

  return (
    <div>
      {loading ? 
      (<Box className={classes.center}>
        <CircularProgress />
      </Box>) :
      (
      <>
        <CreateTransaction accounts={accounts.filter((account) => {
          return !account.deleted_at
        })}/>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Transaction Date</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Finance Account Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {finances.map((finance, index) => (
                  finance.deleted_at ? null : (
                  <TableRow key={index}>
                    <TableCell>{finance.created_at}</TableCell>
                    <TableCell>{finance.title}</TableCell>
                    <TableCell>{accounts.filter((account) => account.id === finance.finance_account_id)[0] && accounts.filter((account) => account.id === finance.finance_account_id)[0].name}</TableCell>
                    <TableCell>{finance.description}</TableCell>
                    <TableCell>{finance.debit_amount}</TableCell>
                    <TableCell>
                      <Button className={classes.btnAction} onClick={handleClick(0)}>Action</Button>
                      <Menu
                        id="fade-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem>
                          <ViewTransaction id={finance.id} account_name={accounts.filter((account) => account.id === finance.finance_account_id)[0] && accounts.filter((account) => account.id === finance.finance_account_id)[0].name}/>
                        </MenuItem>
                        <MenuItem>
                          {/* <EditModal id={account.id}/> */}
                        </MenuItem>
                        <MenuItem>
                          <DeleteTransaction id={finance.id}/>
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                  )
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>)}
      <Button onClick={handleRefresh} className={classes.btnRefresh}>Refresh</Button>
    </div>
  )
}

export default TransactionTab;
