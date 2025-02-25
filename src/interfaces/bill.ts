import { Legislator } from "./legislator";
import { Stage } from "./stage";
import { Status } from "./status";

export interface Bill {
  id: string;
  createdAt: string;
  updatedAt: string;
  detail: string | null;
  links: string[];
  name: string | null;
  number: string;
  ranking: number;
  summary: string | null;
  title: string;
  sponsor: Legislator;
  sponsorId: string;
  stage: Stage;
  stageId: string;
  status: Status;
  statusId: string;
}
