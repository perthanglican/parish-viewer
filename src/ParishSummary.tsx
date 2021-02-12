import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Parishes from './parishes.json';

interface ParishDefinition {
    code: string;
    name: string;
    definition: string[];
    problems: string[];
    geom: string;
};

function PreField({lines}: {lines: string[]}) {
    const ll = lines.map((l) => <div>{l}<br/></div>);
    return <pre>
        {ll}
    </pre>

}

function Parish({ parish }: { parish: ParishDefinition }) {
    return <Row><Col xs={12}>
        <h2 className="mt-4">{parish.name}</h2>
        <table className="table">
            <tbody>
                <tr><th className="w-25" scope="row">Code</th><td>{parish.code}</td></tr>
                <tr><th className="w-25" scope="row">Definition</th><td><PreField lines={parish.definition}/></td></tr>
                <tr><th className="w-25" scope="row">Problems</th><td><PreField lines={parish.problems}/></td></tr>
            </tbody>
        </table>
    </Col></Row>
}


function ParishSummary() {
    const elems = new Array<JSX.Element>();
    for (const [idx, parish] of Parishes.parishes.entries()) {
        elems.push(<Parish key={idx} parish={parish} />);
    }
    return <>
        <Container>
            <h1>Listing of Parishes</h1>
            {elems}
        </Container>
    </>;
}

export { ParishSummary };
