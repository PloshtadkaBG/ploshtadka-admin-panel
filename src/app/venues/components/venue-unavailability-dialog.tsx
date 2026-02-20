"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, CalendarX, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  useVenueUnavailabilities,
  useCreateVenueUnavailability,
  useUpdateVenueUnavailability,
  useDeleteVenueUnavailability,
} from "../hooks";
import type { VenueListItem, VenueUnavailability } from "../types";

interface VenueUnavailabilityDialogProps {
  venue: VenueListItem | null;
  onClose: () => void;
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatForInput(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16);
}

export function VenueUnavailabilityDialog({
  venue,
  onClose,
}: VenueUnavailabilityDialogProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    start_datetime: "",
    end_datetime: "",
    reason: "",
  });

  const { data: unavailabilities = [], isLoading } = useVenueUnavailabilities(
    venue?.id ?? null,
  );
  const { mutate: createUnavailability, isPending: isCreating } =
    useCreateVenueUnavailability();
  const { mutate: updateUnavailability, isPending: isUpdating } =
    useUpdateVenueUnavailability();
  const { mutate: deleteUnavailability, isPending: isDeleting } =
    useDeleteVenueUnavailability();

  const resetForm = () => {
    setFormData({
      start_datetime: "",
      end_datetime: "",
      reason: "",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartAdd = () => {
    // Set default dates (today and tomorrow)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setFormData({
      start_datetime: now.toISOString().slice(0, 16),
      end_datetime: tomorrow.toISOString().slice(0, 16),
      reason: "",
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (u: VenueUnavailability) => {
    setFormData({
      start_datetime: formatForInput(u.start_datetime),
      end_datetime: formatForInput(u.end_datetime),
      reason: u.reason ?? "",
    });
    setEditingId(u.id);
    setIsAdding(false);
  };

  const handleSubmit = () => {
    if (!venue) return;

    const data = {
      start_datetime: new Date(formData.start_datetime).toISOString(),
      end_datetime: new Date(formData.end_datetime).toISOString(),
      reason: formData.reason.trim() || null,
    };

    if (editingId) {
      updateUnavailability(
        {
          venueId: venue.id,
          unavailabilityId: editingId,
          data,
        },
        { onSuccess: resetForm },
      );
    } else {
      createUnavailability(
        {
          venueId: venue.id,
          data,
        },
        { onSuccess: resetForm },
      );
    }
  };

  const handleDelete = (id: string) => {
    if (!venue) return;
    deleteUnavailability({ venueId: venue.id, unavailabilityId: id });
  };

  const isPending = isCreating || isUpdating || isDeleting;

  // Sort unavailabilities by start date (newest first)
  const sortedUnavailabilities = [...unavailabilities].sort(
    (a, b) =>
      new Date(b.start_datetime).getTime() -
      new Date(a.start_datetime).getTime(),
  );

  return (
    <Dialog open={!!venue} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarX className="size-5" />
            Manage Unavailability
          </DialogTitle>
          <DialogDescription>
            {venue
              ? `Set unavailable time periods for ${venue.name}.`
              : "Manage venue unavailability periods."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
              <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    {editingId ? "Edit Unavailability" : "Add Unavailability"}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={resetForm}
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-datetime">Start Date & Time</Label>
                    <Input
                      id="start-datetime"
                      type="datetime-local"
                      value={formData.start_datetime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          start_datetime: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-datetime">End Date & Time</Label>
                    <Input
                      id="end-datetime"
                      type="datetime-local"
                      value={formData.end_datetime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          end_datetime: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (optional)</Label>
                  <Textarea
                    id="reason"
                    placeholder="e.g., Maintenance, Private event, etc."
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !formData.start_datetime ||
                      !formData.end_datetime ||
                      isPending
                    }
                  >
                    {isPending && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    {editingId ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            )}

            {/* Add Button */}
            {!isAdding && !editingId && (
              <Button onClick={handleStartAdd} className="w-full">
                <Plus className="mr-2 size-4" />
                Add Unavailability Period
              </Button>
            )}

            {/* Unavailabilities List */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">
                Unavailable Periods ({unavailabilities.length})
              </h4>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : sortedUnavailabilities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarX className="size-12 mx-auto mb-3 opacity-50" />
                  <p>No unavailability periods set.</p>
                  <p className="text-sm">The venue is available for booking.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedUnavailabilities.map((u) => {
                    const isPast =
                      new Date(u.end_datetime).getTime() < Date.now();
                    return (
                      <div
                        key={u.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          isPast ? "bg-muted/30 opacity-60" : "bg-background"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant={isPast ? "secondary" : "default"}
                              className="text-xs"
                            >
                              {isPast ? "Past" : "Upcoming"}
                            </Badge>
                            {u.reason && (
                              <span className="text-sm font-medium">
                                {u.reason}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDateTime(u.start_datetime)}
                            <span className="mx-2">→</span>
                            {formatDateTime(u.end_datetime)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleStartEdit(u)}
                            disabled={isPending}
                            title="Edit"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(u.id)}
                            disabled={isPending}
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
