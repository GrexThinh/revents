import { OrderByDirection, WhereFilterOp } from "firebase/firestore";

export type CollectionOptions = {
  queries: QueryOption[];
  sort?: SortOptions;
};

export type QueryOption = {
  attribute: string;
  operator: WhereFilterOp;
  value: string | number | boolean | Date | any[];
};

type SortOptions = {
  attribute: string;
  order: OrderByDirection;
};
