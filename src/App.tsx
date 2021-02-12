import React from 'react';
import './App.css';
import { Navbar, NavbarBrand, Button, Badge, ButtonToolbar } from 'reactstrap';
import { ParishMap } from './ParishMap';
import { ParishSummary } from './ParishSummary';
import { HashRouter, Route, useLocation, Link } from 'react-router-dom';
import Parishes from './parishes.json';

function LinkBar() {
    const location = useLocation();
    const atSummary = location.pathname === '/summary';
    const atMap = location.pathname === '/';

    const ActiveButton = ({active, children, to} : {active: Boolean, children: any, to: string}) => {
        return <Button 
            className={active ? 'active' : undefined}
            tag={Link}
            to={to}>{children}</Button>
    };

    return <ButtonToolbar>
        <ActiveButton active={atMap} to="/">Map</ActiveButton>
        <ActiveButton active={atSummary} to="/summary">Summary</ActiveButton>
    </ButtonToolbar>;
}

function TopBar() {
    return <Navbar color="dark" dark>
        <NavbarBrand>Anglican Church Diocese of Perth: Digitised Boundaries <Badge>{ Parishes.parishes.length }</Badge></NavbarBrand>
        <LinkBar />
    </Navbar>;
}


function App() {
    return <>
        <HashRouter>
            <TopBar />
            <Route path="/" exact render={(props) => 
                <ParishMap />
            } />
            <Route path="/summary" exact render={(props) => 
                <ParishSummary />
            } />
        </HashRouter>
    </>;
}

export default App;
