import { Ticket } from "@shared/models/Ticket";
import { CrmStatus } from "./Ticket_enum.enum";

export interface RuleResponse {
  resolution: boolean;
  error: string;
  data?: any;
}
export interface KanbanColum {
  id: number;
  title: string;
  key: CrmStatus,
  color: string,
  list: Ticket[];
  rules: {
    drag?: Array<(from: KanbanColum, to: KanbanColum, ticket: Ticket) => RuleResponse | Promise<RuleResponse>>,
    drop?: Array<(from: KanbanColum, to: KanbanColum, ticket: Ticket) => RuleResponse | Promise<RuleResponse> | void>,
    change?: Array<(column: KanbanColum, ticket: Ticket) => RuleResponse | Promise<RuleResponse> | void>
  };
}
