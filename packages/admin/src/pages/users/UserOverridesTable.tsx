import { SearchInput } from "@/components/SearchInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FlagValueCell } from "@/components/FlagValueCell";
import type { Flag, UserOverride } from "@/types/api";
import { formatValue } from "@/utils/flags";
import { useState } from "react";
import { useSetUserOverride } from "@/hooks/api/useSetUserOverride";
import { useDeleteUserOverride } from "@/hooks/api/useDeleteUserOverride";

interface OverridesTableProps {
  userKey: string;
  flags: Flag[];
  overrides: UserOverride[];
}

export default function OverridesTable({
  userKey,
  flags,
  overrides,
}: OverridesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { mutate: setOverride } = useSetUserOverride(userKey);
  const { mutate: deleteOverride } = useDeleteUserOverride(userKey);

  const overrideMap = new Map(overrides.map((o) => [o.flagKey, o]));

  const filtered = flags.filter((flag) =>
    flag.key.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm font-medium">Overrides</span>
      <SearchInput
        placeholder="Search flags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flag</TableHead>
              <TableHead>Default</TableHead>
              <TableHead>Override</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((flag) => {
                const override = overrideMap.get(flag.key);

                return (
                  <TableRow key={flag.key}>
                    <TableCell className="font-mono font-medium px-4 py-3">
                      {flag.key}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground px-4 py-3">
                      {formatValue(flag.defaultValue)}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <FlagValueCell
                        flag={flag}
                        value={override?.value ?? flag.defaultValue}
                        onChange={(value) =>
                          setOverride({ flagKey: flag.key, value })
                        }
                        onReset={
                          override ? () => deleteOverride(flag.key) : undefined
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No flags found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
