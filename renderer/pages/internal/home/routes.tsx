import React from 'react'
import { RoutesProp } from '../../../utils/props'
import { routing } from '../../../utils/routesoptions'
import Dashboard from './tabs/dashboard'
import Menu from './tabs/menu';
import Inventory from './tabs/inventory';
import Account from './tabs/account';

function Routes({ tab }: RoutesProp) {
  switch(tab){
    case routing.DASHBOARD_ROUTE:
        return <Dashboard />;
    case routing.MENU_ROUTE:
        return <Menu />;
    case routing.INVENTORY_ROUTE:
        return <Inventory />;
    case routing.ACCOUNT_ROUTE:
        return <Account />;
    default:
        break;
  }
}

export default Routes