import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useRouter } from 'next/router';
import List from '@material-ui/core/List';

const ItemList = () => {
  const router = useRouter()

  const handleClick = (path: string) => (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    router.push(path);
  }

  return (
    <List>
      <ListItem button onClick={handleClick('/dashboard')}>
        <ListItemIcon>
          <DashboardIcon style={{color: 'white'}}/>
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button onClick={handleClick('/finance')}>
        <ListItemIcon>
          <ShoppingCartIcon style={{color: 'white'}}/>
        </ListItemIcon>
        <ListItemText primary="Finance" />
      </ListItem>
    </List>
  )
}

export default ItemList;