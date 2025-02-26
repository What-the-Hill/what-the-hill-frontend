export interface Legislator {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  bills: { title: string }[];
  floorBills: { title: string }[];
}
