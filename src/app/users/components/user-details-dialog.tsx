"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { User } from "../types";

interface UserDetailsDialogProps {
  user: User | null;
  onClose: () => void;
  onEditClick: (user: User) => void;
}

export function UserDetailsDialog({
  user,
  onClose,
  onEditClick,
}: UserDetailsDialogProps) {
  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Full profile information for this account.
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-muted-foreground">Username</span>
              <span className="font-medium">@{user.username}</span>

              <span className="text-muted-foreground">Full Name</span>
              <span className="font-medium">{user.full_name ?? "—"}</span>

              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user.email ?? "—"}</span>

              <span className="text-muted-foreground">Status</span>
              <Badge
                variant="secondary"
                className={
                  user.is_active
                    ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20 w-fit"
                    : "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20 w-fit"
                }
              >
                {user.is_active ? "Active" : "Inactive"}
              </Badge>

              <span className="text-muted-foreground">Joined</span>
              <span className="font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </span>

              <span className="text-muted-foreground">ID</span>
              <span className="font-mono text-xs text-muted-foreground truncate">
                {user.id}
              </span>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Scopes</p>
              {user.scopes && (user.scopes as string[]).length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {(user.scopes as string[]).map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="text-xs font-mono"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No scopes assigned.
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              if (user) {
                onClose();
                onEditClick(user);
              }
            }}
            className="cursor-pointer"
          >
            Edit User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
