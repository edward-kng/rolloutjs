import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUpdateUser } from "@/hooks/api/useUpdateUser";
import { useCreateUser } from "@/hooks/api/useCreateUser";
import { useDeleteUser } from "@/hooks/api/useDeleteUser";
import type { User } from "@/types/api";
import { KeyValueEditor } from "@/components/KeyValueEditor";
import { useFlags } from "@/hooks/api/useFlags";
import { useUserOverrides } from "@/hooks/api/useUserOverrides";
import OverridesTable from "./UserOverridesTable";

interface UserEditViewProps {
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserEditView({
  user,
  open,
  onOpenChange,
}: UserEditViewProps) {
  const initialAttrs = user?.attributes ?? {};

  const [key, setKey] = useState("");
  const [attributes, setAttributes] =
    useState<Record<string, unknown>>(initialAttrs);

  const { data: flags } = useFlags();
  const { data: overrides } = useUserOverrides(user?.key);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const isCreate = !user;
  const isPending = isUpdating || isCreating || isDeleting;

  function handleSave() {
    const attrs = attributes;

    if (isCreate) {
      createUser(
        { key, attributes: attrs },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      updateUser(
        { key: user.key, user: { attributes: attrs } },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="md:min-w-2/5 min-w-1/2 flex">
        <SheetHeader>
          <SheetTitle className="font-medium">
            {isCreate ? "Create user" : user.key}
          </SheetTitle>
          <SheetDescription>
            {isCreate ? "Create a new user." : "Edit attributes for this user."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-12 px-6">
          {isCreate && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Key</span>
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="user-key"
                className="font-mono"
              />
            </label>
          )}

          <KeyValueEditor
            label="Attributes"
            value={initialAttrs}
            onChange={setAttributes}
          />
          {user && flags && (
            <OverridesTable
              userKey={user.key}
              flags={flags}
              overrides={overrides ?? []}
            />
          )}
        </div>

        <SheetFooter>
          {!isCreate && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isPending}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete user</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete{" "}
                    <span className="font-mono font-medium text-foreground">
                      {user.key}
                    </span>
                    ? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() =>
                      deleteUser(user.key, {
                        onSuccess: () => onOpenChange(false),
                      })
                    }
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            onClick={handleSave}
            disabled={isPending || (isCreate && !key.trim())}
          >
            {isCreating || isUpdating
              ? "Saving..."
              : isCreate
                ? "Create"
                : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
