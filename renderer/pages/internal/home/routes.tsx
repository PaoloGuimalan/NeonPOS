import React from 'react'
import { RoutesProp } from '../../../utils/props'
import { routing } from '../../../utils/routesoptions'
import Dashboard from './tabs/dashboard'
import Menu from './tabs/menu';
import Inventory from './tabs/inventory';
import Account from './tabs/account';
import Permissions from './tabs/permissions';
import Users from './tabs/users';
import Orders from './tabs/orders';
import Welcome from '../../../components/holders/welcome';

function Routes({ tab }: RoutesProp) {
  switch(tab){
    case routing.DASHBOARD_ROUTE:
        return <Dashboard />;
    case routing.MENU_ROUTE:
        return <Menu />;
    case routing.ORDERS_ROUTE:
        return <Orders />;
    case routing.INVENTORY_ROUTE:
        return <Inventory />;
    case routing.PERMISSIONS_ROUTE:
        return <Permissions />;
    case routing.USERS_ROUTE:
        return <Users />;
    case routing.ACCOUNT_ROUTE:
        return <Account />;
    default:
        return <Welcome />;
  }
}

export default Routes