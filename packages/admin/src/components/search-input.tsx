import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/ui";

function SearchInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <div className={cn("relative max-w-sm", className)}>
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input className="pl-9" {...props} />
    </div>
  );
}

export { SearchInput };
