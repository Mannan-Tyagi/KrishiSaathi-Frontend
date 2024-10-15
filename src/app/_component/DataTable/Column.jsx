// types.js
import { ColumnDef } from "@tanstack/react-table";

// Define the data structure for Payment without TypeScript
export const columns = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
