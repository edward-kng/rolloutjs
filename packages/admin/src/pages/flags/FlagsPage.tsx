import { useFlags } from "@/hooks/api/useFlags";
import FlagsTable from "./FlagsTable";

export default function FlagsPage() {
  const { data: flags } = useFlags();

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Flags</h1>
      </div>

      <FlagsTable flags={flags ?? []} />
    </div>
  );
}
