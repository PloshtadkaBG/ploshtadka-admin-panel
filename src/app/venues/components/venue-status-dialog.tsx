"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUpdateVenueStatus } from "../hooks";
import type { VenueListItem, VenueStatus } from "../types";

const statusOptions: {
  value: VenueStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "active",
    label: "Active",
    description: "Venue is available for bookings",
  },
  {
    value: "inactive",
    label: "Inactive",
    description: "Venue is temporarily unavailable",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    description: "Venue is under maintenance",
  },
  {
    value: "pending_approval",
    label: "Pending Approval",
    description: "Venue is awaiting admin approval",
  },
];

interface VenueStatusDialogProps {
  venue: VenueListItem | null;
  onClose: () => void;
}

export function VenueStatusDialog({ venue, onClose }: VenueStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<VenueStatus>("active");
  const { mutate: updateStatus, isPending } = useUpdateVenueStatus();

  useEffect(() => {
    if (venue) {
      setSelectedStatus(venue.status);
    }
  }, [venue]);

  const handleSave = () => {
    if (!venue) return;
    updateStatus(
      { id: venue.id, status: selectedStatus },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog open={!!venue} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Venue Status</DialogTitle>
          <DialogDescription>
            {venue
              ? `Change the status for ${venue.name}.`
              : "Change the venue status."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as VenueStatus)}
            className="space-y-3"
          >
            {statusOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-start space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedStatus(option.value)}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={option.value}
                    className="font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || selectedStatus === venue?.status}
            className="cursor-pointer"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
