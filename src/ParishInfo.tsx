import Parishes from './parishes.json';

interface ParishDefinition {
    code: string;
    name: string;
    definition: string[];
    problems: string[];
    geom: string;
};


export type { ParishDefinition };
export { Parishes };