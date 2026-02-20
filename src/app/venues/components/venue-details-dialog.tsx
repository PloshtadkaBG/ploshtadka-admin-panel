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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { VenueListItem } from "../types";
import { useVenue } from "../hooks";
import {
  MapPin,
  Users,
  Star,
  Building2,
  Car,
  ShowerHead,
  Shirt,
  Wrench,
  Clock,
  Image as ImageIcon,
  CalendarX,
  Pencil,
  ImagePlus,
  CalendarPlus,
} from "lucide-react";

interface VenueDetailsDialogProps {
  venue: VenueListItem | null;
  onClose: () => void;
  onEditClick: (venue: VenueListItem) => void;
  onManageImages?: (venue: VenueListItem) => void;
  onManageUnavailability?: (venue: VenueListItem) => void;
}

const statusColors: Record<string, string> = {
  active: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
  inactive: "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20",
  maintenance:
    "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20",
  pending_approval:
    "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20",
};

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-start gap-4 py-1">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-right">{value}</span>
    </div>
  );
}

function AmenityBadge({
  icon,
  label,
  enabled,
}: {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border ${
        enabled
          ? "border-primary/30 bg-primary/5 text-primary"
          : "border-muted bg-muted/30 text-muted-foreground line-through"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

export function VenueDetailsDialog({
  venue,
  onClose,
  onEditClick,
  onManageImages,
  onManageUnavailability,
}: VenueDetailsDialogProps) {
  const { data: fullVenue, isLoading } = useVenue(venue?.id ?? null);

  if (!venue) return null;

  // Use full venue data if available, fall back to list item data
  const v = fullVenue ?? venue;

  return (
    <Dialog open={!!venue} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Venue Details</DialogTitle>
          <DialogDescription>
            Complete information about this venue.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh]">
          {isLoading ? (
            <div className="space-y-4 pr-4">
              <div className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="space-y-6 pr-4">
              {/* Header with images */}
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {fullVenue?.images?.[0]?.url ? (
                    <img
                      src={fullVenue.images[0].url}
                      alt={v.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (venue as any).thumbnail ? (
                    <img
                      src={(venue as any).thumbnail}
                      alt={v.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="size-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{v.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <MapPin className="size-3.5" />
                    <span>
                      {fullVenue?.address ? `${fullVenue.address}, ` : ""}
                      {v.city}
                    </span>
                  </div>
                  {fullVenue?.latitude && fullVenue?.longitude && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {fullVenue.latitude}, {fullVenue.longitude}
                    </p>
                  )}
                  <Badge
                    variant="secondary"
                    className={`mt-2 capitalize ${statusColors[v.status]}`}
                  >
                    {v.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              {/* Image Gallery */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <ImageIcon className="size-4" /> Photos (
                    {fullVenue?.images?.length ?? 0})
                  </p>
                  {onManageImages && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1"
                      onClick={() => onManageImages(venue)}
                    >
                      <ImagePlus className="size-3.5" />
                      Manage
                    </Button>
                  )}
                </div>
                {fullVenue?.images && fullVenue.images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {fullVenue.images.slice(0, 8).map((img, i) => (
                      <div
                        key={img.id ?? i}
                        className="aspect-square rounded-md overflow-hidden bg-muted relative"
                      >
                        <img
                          src={img.url}
                          alt={`Venue photo ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {img.is_thumbnail && (
                          <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                            Thumb
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground border rounded-lg">
                    <ImageIcon className="size-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No images yet</p>
                    {onManageImages && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => onManageImages(venue)}
                      >
                        <ImagePlus className="size-3.5 mr-1" />
                        Add Images
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {fullVenue?.description && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {fullVenue.description}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                    <Star className="size-4 fill-current" />
                    <span className="font-semibold">{v.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {v.total_reviews} reviews
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <span className="font-semibold">{v.price_per_hour}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {v.currency}/hour
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <Users className="size-4" />
                    <span className="font-semibold">{v.capacity}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Capacity</p>
                </div>
              </div>

              {fullVenue?.total_bookings != null && (
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <span className="font-semibold text-primary">
                    {fullVenue.total_bookings}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Total Bookings
                  </p>
                </div>
              )}

              <Separator />

              {/* Sport Types */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Sport Types</p>
                <div className="flex flex-wrap gap-1">
                  {v.sport_types.length > 0 ? (
                    v.sport_types.map((sport) => (
                      <Badge
                        key={sport}
                        variant="outline"
                        className="capitalize"
                      >
                        {sport}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No sport types specified
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Venue Type & Amenities */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Facilities & Amenities</p>
                <div className="flex flex-wrap gap-2">
                  <AmenityBadge
                    icon={<Building2 className="size-3.5" />}
                    label={v.is_indoor ? "Indoor" : "Outdoor"}
                    enabled={true}
                  />
                  {fullVenue && (
                    <>
                      <AmenityBadge
                        icon={<Car className="size-3.5" />}
                        label="Parking"
                        enabled={fullVenue.has_parking}
                      />
                      <AmenityBadge
                        icon={<Shirt className="size-3.5" />}
                        label="Changing Rooms"
                        enabled={fullVenue.has_changing_rooms}
                      />
                      <AmenityBadge
                        icon={<ShowerHead className="size-3.5" />}
                        label="Showers"
                        enabled={fullVenue.has_showers}
                      />
                      <AmenityBadge
                        icon={<Wrench className="size-3.5" />}
                        label="Equipment Rental"
                        enabled={fullVenue.has_equipment_rental}
                      />
                    </>
                  )}
                </div>

                {/* Extra amenities */}
                {fullVenue?.amenities && fullVenue.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {fullVenue.amenities.map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="secondary"
                        className="text-xs capitalize"
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Working Hours */}
              {fullVenue?.working_hours && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-1.5">
                      <Clock className="size-4" /> Working Hours
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      {Object.entries(fullVenue.working_hours).map(
                        ([day, hours]) => (
                          <div
                            key={day}
                            className="flex justify-between items-center text-sm py-0.5"
                          >
                            <span className="text-muted-foreground w-10 shrink-0">
                              {DAY_LABELS[day] ?? day}
                            </span>
                            {hours ? (
                              <span className="font-mono text-xs">
                                {(hours as any).open} – {(hours as any).close}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Closed
                              </span>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Unavailabilities */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <CalendarX className="size-4" /> Unavailable Periods (
                    {fullVenue?.unavailabilities?.length ?? 0})
                  </p>
                  {onManageUnavailability && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1"
                      onClick={() => onManageUnavailability(venue)}
                    >
                      <CalendarPlus className="size-3.5" />
                      Manage
                    </Button>
                  )}
                </div>
                {fullVenue?.unavailabilities &&
                fullVenue.unavailabilities.length > 0 ? (
                  <div className="space-y-1">
                    {fullVenue.unavailabilities.slice(0, 5).map((u, i) => {
                      const isPast =
                        new Date(u.end_datetime).getTime() < Date.now();
                      return (
                        <div
                          key={u.id ?? i}
                          className={`flex justify-between items-center text-sm px-3 py-2 rounded-md ${
                            isPast ? "bg-muted/30 opacity-60" : "bg-muted/50"
                          }`}
                        >
                          <span className="text-muted-foreground">
                            {u.reason ?? "Unavailable"}
                          </span>
                          <span className="font-mono text-xs">
                            {new Date(u.start_datetime).toLocaleDateString()} →{" "}
                            {new Date(u.end_datetime).toLocaleDateString()}
                          </span>
                        </div>
                      );
                    })}
                    {fullVenue.unavailabilities.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center py-1">
                        +{fullVenue.unavailabilities.length - 5} more periods
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground border rounded-lg">
                    <CalendarX className="size-6 mx-auto mb-1 opacity-50" />
                    <p className="text-sm">No unavailability periods</p>
                    {onManageUnavailability && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => onManageUnavailability(venue)}
                      >
                        <CalendarPlus className="size-3.5 mr-1" />
                        Add Period
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Owner & Meta */}
              <div className="space-y-1">
                <p className="text-sm font-medium">Details</p>
                {fullVenue?.owner_id && (
                  <DetailRow
                    label="Owner ID"
                    value={
                      <span className="font-mono text-xs">
                        {fullVenue.owner_id}
                      </span>
                    }
                  />
                )}
                <DetailRow
                  label="Venue ID"
                  value={<span className="font-mono text-xs">{v.id}</span>}
                />
                {fullVenue?.updated_at && (
                  <DetailRow
                    label="Last updated"
                    value={new Date(fullVenue.updated_at).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  />
                )}
              </div>
            </div>
          )}
        </ScrollArea>

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
              onClose();
              onEditClick(venue);
            }}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 size-4" />
            Edit Venue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
