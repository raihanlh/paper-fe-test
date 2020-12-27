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
import ViewModal from '../../components/AccountTab/ViewModal';
import DeleteModal from '../../components/AccountTab/DeleteModal';
import EditModal from '../../components/AccountTab/EditModal';
import CreateAccount from '../../components/AccountTab/CreateAccount';

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
  }
}))

const AccountTab = () => {
  const cookies = new Cookies();
  const classes = useStyles();
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
      console.log(accounts);
    })
  }, [])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (id: number) => (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    let auth = `Bearer ${cookies.get('token')}`;
    axios.get('/api/finance-accounts', {
      headers: {
        "Authorization": auth
      }
    }).then((res) => {
      console.log(res.data.data)
      setAccounts(res.data.data);
      console.log(accounts);
    })
  }

  return (
    <div>
      <CreateAccount />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Account Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Account Type</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {accounts.map((account) => (
                account.deleted_at ? null : (
                <TableRow key={account.id}>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.description}</TableCell>
                  <TableCell>{account.type}</TableCell>
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
                        <ViewModal id={account.id}/>
                      </MenuItem>
                      <MenuItem>
                        <EditModal id={account.id}/>
                      </MenuItem>
                      <MenuItem>
                        <DeleteModal id={account.id}/>
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
                )
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleRefresh} className={classes.btnRefresh}>Refresh</Button>
    </div>
  )
}

export default AccountTab;
