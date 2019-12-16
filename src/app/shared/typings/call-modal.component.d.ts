import { GenericModel } from "@shared/utils/GenericModel";
import { Ticket } from "@shared/models/Ticket";
import { Modules } from "@shared/utils/modules.enum";
import { BasicInfo } from "./Ticket";

export interface Agreement {
    id: number,
    label: string,
    contract_status: string
}

export interface userToAssign {
    id: number;
    label: string;
}

export interface Contact {
    id: number;
    label: string;
}

export interface Client {
    id: number;
    recordLabel: string;
}

export interface CallModalFormReturn {
    name: string;
    description: string;
    date_start: Date;
    date_end: Date;
    visible: boolean;
    parent: any[];
    user: BasicInfo;
    ticket: {
        id: number;
        mod: Modules;
        label: string;
        description: string;
    };
}


