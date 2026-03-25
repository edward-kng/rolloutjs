import { SearchInput } from "@/components/SearchInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Flag, FlagValue } from "@/types/api";
import { formatValue } from "@/utils/flags";
import { cn } from "@/utils/ui";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

type FlagRow = {
  key: string;
  type: string;
  value: FlagValue;
};

const FLAG_COLUMNS: ColumnDef<FlagRow>[] = [
  {
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];

interface FlagsTableProps {
  flags: Flag[];
}

export default function FlagsTable({ flags }: FlagsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const flagRows: FlagRow[] = useMemo(
    () =>
      flags?.map((flag) => ({
        key: flag.key,
        type: typeof flag.defaultValue,
        value: formatValue(flag.defaultValue),
      })),
    [flags],
  );
  const table = useReactTable({
    data: flagRows,
    columns: FLAG_COLUMNS,
    state: { globalFilter: searchQuery },
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        placeholder="Search flags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "font-mono text-muted-foreground px-4 py-3",
                        {
                          "text-white font-medium hover:underline cursor-pointer":
                            cell.column.id === "key",
                        },
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={FLAG_COLUMNS.length}>
                  No flags found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
