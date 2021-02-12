import React from 'react';
import './App.css';
import { Navbar, NavbarBrand, ButtonToggle, Badge } from 'reactstrap';
import { ParishMap } from './ParishMap';
import Parishes from './parishes.json';

function TopBar({ showSummary, setShowSummary }: { showSummary: boolean, setShowSummary: any }) {
    return <Navbar color="dark" dark>
        <NavbarBrand>Anglican Church Diocese of Perth: Digitised Boundaries <Badge>{ Parishes.parishes.length }</Badge></NavbarBrand>
        <ButtonToggle
            className={showSummary ? 'active' : undefined}
            onClick={() => setShowSummary(!showSummary)}>Show summary</ButtonToggle>
    </Navbar>;
}


function App() {
    const [showSummary, setShowSummary] = React.useState<boolean>(false);
    return <>
        <TopBar showSummary={showSummary} setShowSummary={setShowSummary} />
        <ParishMap showSummary={showSummary} setShowSummary={setShowSummary} />
    </>;
}

export default App;
