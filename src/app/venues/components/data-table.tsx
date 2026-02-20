"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  EllipsisVertical,
  Trash2,
  Download,
  Search,
  Loader2,
  MapPin,
  Building2,
  Star,
  Users,
  Activity,
  Settings2,
  Image as ImageIcon,
  CalendarX,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VenueFormDialog } from "./venue-form-dialog";
import { VenueDetailsDialog } from "./venue-details-dialog";
import { VenueEditDialog } from "./venue-edit-dialog";
import { VenueStatusDialog } from "./venue-status-dialog";
import { VenueImagesDialog } from "./venue-images-dialog";
import { VenueUnavailabilityDialog } from "./venue-unavailability-dialog";
import type { VenueListItem, VenueFormValues, VenueStatus } from "../types";
import { Eye, Pencil } from "lucide-react";

interface DataTableProps {
  venues: VenueListItem[];
  loading: boolean;
  onDeleteVenue: (id: string) => void;
  onAddVenue: (venueData: VenueFormValues) => void;
}

const statusColors: Record<VenueStatus, string> = {
  active: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
  inactive: "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20",
  maintenance:
    "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20",
  pending_approval:
    "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20",
};

const sportTypeIcons: Record<string, string> = {
  football: "⚽",
  basketball: "🏀",
  tennis: "🎾",
  volleyball: "🏐",
  swimming: "🏊",
  gym: "💪",
  padel: "🎾",
  other: "🏃",
};

export function DataTable({
  venues,
  loading,
  onDeleteVenue,
  onAddVenue,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusVenue, setStatusVenue] = useState<VenueListItem | null>(null);
  const [detailsVenue, setDetailsVenue] = useState<VenueListItem | null>(null);
  const [editVenue, setEditVenue] = useState<VenueListItem | null>(null);
  const [imagesVenue, setImagesVenue] = useState<VenueListItem | null>(null);
  const [unavailabilityVenue, setUnavailabilityVenue] =
    useState<VenueListItem | null>(null);

  const columns: ColumnDef<VenueListItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center px-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center px-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: "name",
      header: "Venue",
      cell: ({ row }) => {
        const venue = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
              {venue.thumbnail ? (
                <img
                  src={venue.thumbnail}
                  alt={venue.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="size-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate">{venue.name}</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3" />
                <span className="truncate">{venue.city}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as VenueStatus;
        return (
          <Badge
            variant="secondary"
            className={`capitalize ${statusColors[status]}`}
          >
            {status.replace("_", " ")}
          </Badge>
        );
      },
      filterFn: (row, columnId, value) => {
        if (value === "" || value === "all") return true;
        const status = row.getValue(columnId) as VenueStatus;
        return status === value;
      },
    },
    {
      accessorKey: "sport_types",
      header: "Sports",
      cell: ({ row }) => {
        const sports = row.getValue("sport_types") as string[];
        if (!sports || sports.length === 0) {
          return <span className="text-muted-foreground text-sm">None</span>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {sports.slice(0, 3).map((sport) => (
              <Badge
                key={sport}
                variant="outline"
                className="text-xs capitalize"
              >
                {sportTypeIcons[sport] || "•"} {sport}
              </Badge>
            ))}
            {sports.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{sports.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "price_per_hour",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price_per_hour") as string;
        const currency = row.original.currency;
        return (
          <span className="font-medium">
            {price} {currency}/h
          </span>
        );
      },
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => {
        const capacity = row.getValue("capacity") as number;
        return (
          <div className="flex items-center gap-1">
            <Users className="size-4 text-muted-foreground" />
            <span>{capacity}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "is_indoor",
      header: "Type",
      cell: ({ row }) => {
        const isIndoor = row.getValue("is_indoor") as boolean;
        return (
          <Badge variant={isIndoor ? "default" : "outline"}>
            {isIndoor ? "Indoor" : "Outdoor"}
          </Badge>
        );
      },
      filterFn: (row, columnId, value) => {
        if (value === "" || value === "all") return true;
        const isIndoor = row.getValue(columnId) as boolean;
        return value === "indoor" ? isIndoor : !isIndoor;
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as string;
        const totalReviews = row.original.total_reviews;
        return (
          <div className="flex items-center gap-1">
            <Star className="size-4 text-amber-500 fill-amber-500" />
            <span className="font-medium">{rating}</span>
            <span className="text-xs text-muted-foreground">
              ({totalReviews})
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const venue = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              title="Manage Images"
              onClick={() => setImagesVenue(venue)}
            >
              <ImageIcon className="size-4" />
              <span className="sr-only">Manage images</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              title="Manage Unavailability"
              onClick={() => setUnavailabilityVenue(venue)}
            >
              <CalendarX className="size-4" />
              <span className="sr-only">Manage unavailability</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              title="Change Status"
              onClick={() => setStatusVenue(venue)}
            >
              <Activity className="size-4" />
              <span className="sr-only">Change status</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => setDetailsVenue(venue)}
            >
              <Eye className="size-4" />
              <span className="sr-only">View details</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => setEditVenue(venue)}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Edit venue</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <EllipsisVertical className="size-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setImagesVenue(venue)}
                >
                  <ImageIcon className="mr-2 size-4" />
                  Manage Images
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setUnavailabilityVenue(venue)}
                >
                  <CalendarX className="mr-2 size-4" />
                  Manage Unavailability
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setStatusVenue(venue)}
                >
                  <Activity className="mr-2 size-4" />
                  Change Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setEditVenue(venue)}
                >
                  <Settings2 className="mr-2 size-4" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => onDeleteVenue(venue.id)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete Venue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: venues,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const statusFilter = table.getColumn("status")?.getFilterValue() as string;
  const typeFilter = table.getColumn("is_indoor")?.getFilterValue() as string;

  return (
    <div className="w-full space-y-4">
      {/* Dialogs */}
      <VenueStatusDialog
        venue={statusVenue}
        onClose={() => setStatusVenue(null)}
      />
      <VenueDetailsDialog
        venue={detailsVenue}
        onClose={() => setDetailsVenue(null)}
        onEditClick={setEditVenue}
      />
      <VenueEditDialog venue={editVenue} onClose={() => setEditVenue(null)} />
      <VenueImagesDialog
        venue={imagesVenue}
        onClose={() => setImagesVenue(null)}
      />
      <VenueUnavailabilityDialog
        venue={unavailabilityVenue}
        onClose={() => setUnavailabilityVenue(null)}
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search venues..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(String(e.target.value))}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="cursor-pointer">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <VenueFormDialog onAddVenue={onAddVenue} />
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="cursor-pointer w-full">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Type</Label>
          <Select
            value={typeFilter || "all"}
            onValueChange={(value) =>
              table.getColumn("is_indoor")?.setFilterValue(value)
            }
          >
            <SelectTrigger className="cursor-pointer w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="indoor">Indoor</SelectItem>
              <SelectItem value="outdoor">Outdoor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Column Visibility</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer w-full">
                Columns <ChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader2 className="size-5 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium">Show</Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-20 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium hidden sm:block">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
