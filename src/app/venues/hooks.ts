import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  Venue,
  VenueListItem,
  VenueFormValues,
  VenueUpdate,
  VenueStatusUpdate,
  VenueStatus,
  VenueImage,
  VenueImageCreate,
  VenueImageUpdate,
  VenueUnavailability,
  VenueUnavailabilityCreate,
  VenueUnavailabilityUpdate,
} from "./types";
import { api } from "@/lib/api";

const VENUES_KEY = ["venues"];

// ─── Venue Queries & Mutations ────────────────────────────────────────────────

export function useVenues() {
  return useQuery({
    queryKey: VENUES_KEY,
    queryFn: fetchVenues,
  });
}

const fetchVenues = () =>
  api.get<VenueListItem[]>("/venues").then((r) => r.data);

export function useVenue(id: string | null) {
  return useQuery({
    queryKey: [...VENUES_KEY, id],
    queryFn: () => fetchVenue(id!),
    enabled: !!id,
  });
}

const fetchVenue = (id: string) =>
  api.get<Venue>(`/venues/${id}`).then((r) => r.data);

export function useAddVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: VenueFormValues) =>
      api.post<Venue>("/venues", data).then((r) => r.data),
    onSuccess: (newVenue) => {
      qc.setQueryData<VenueListItem[]>(VENUES_KEY, (prev = []) => [
        {
          id: newVenue.id,
          name: newVenue.name,
          city: newVenue.city,
          sport_types: newVenue.sport_types,
          status: newVenue.status,
          price_per_hour: newVenue.price_per_hour,
          currency: newVenue.currency,
          capacity: newVenue.capacity,
          is_indoor: newVenue.is_indoor,
          rating: newVenue.rating,
          total_reviews: newVenue.total_reviews,
          thumbnail: newVenue.images.find((i) => i.is_thumbnail)?.url ?? null,
        },
        ...prev,
      ]);
    },
  });
}

export function useDeleteVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/venues/${id}`),
    onSuccess: (_, id) => {
      qc.setQueryData<VenueListItem[]>(VENUES_KEY, (prev = []) =>
        prev.filter((v) => v.id !== id),
      );
    },
  });
}

export function useUpdateVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VenueUpdate }) =>
      api.patch<Venue>(`/venues/${id}`, data).then((r) => r.data),
    onSuccess: (updatedVenue) => {
      qc.setQueryData<VenueListItem[]>(VENUES_KEY, (prev = []) =>
        prev.map((v) =>
          v.id === updatedVenue.id
            ? {
                ...v,
                name: updatedVenue.name,
                city: updatedVenue.city,
                sport_types: updatedVenue.sport_types,
                status: updatedVenue.status,
                price_per_hour: updatedVenue.price_per_hour,
                currency: updatedVenue.currency,
                capacity: updatedVenue.capacity,
                is_indoor: updatedVenue.is_indoor,
              }
            : v,
        ),
      );
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, updatedVenue.id] });
    },
  });
}

export function useUpdateVenueStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: VenueStatus }) =>
      api
        .patch<VenueStatusUpdate>(`/venues/${id}/status`, { status })
        .then((r) => r.data),
    onSuccess: (_, { id, status }) => {
      qc.setQueryData<VenueListItem[]>(VENUES_KEY, (prev = []) =>
        prev.map((v) => (v.id === id ? { ...v, status } : v)),
      );
    },
  });
}

// ─── Venue Image Queries & Mutations ──────────────────────────────────────────

export function useVenueImages(venueId: string | null) {
  return useQuery({
    queryKey: [...VENUES_KEY, venueId, "images"],
    queryFn: () => fetchVenueImages(venueId!),
    enabled: !!venueId,
  });
}

const fetchVenueImages = (venueId: string) =>
  api.get<VenueImage[]>(`/venues/${venueId}/images`).then((r) => r.data);

export function useAddVenueImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      venueId,
      data,
    }: {
      venueId: string;
      data: VenueImageCreate;
    }) =>
      api
        .post<VenueImage>(`/venues/${venueId}/images`, data)
        .then((r) => r.data),
    onSuccess: (_, { venueId }) => {
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, venueId, "images"] });
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, venueId] });
      qc.invalidateQueries({ queryKey: VENUES_KEY });
    },
  });
}

export function useUpdateVenueImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      venueId,
      imageId,
      data,
    }: {
      venueId: string;
      imageId: string;
      data: VenueImageUpdate;
    }) =>
      api
        .patch<VenueImage>(`/venues/${venueId}/images/${imageId}`, data)
        .then((r) => r.data),
    onSuccess: (_, { venueId }) => {
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, venueId, "images"] });
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, venueId] });
      qc.invalidateQueries({ queryKey: VENUES_KEY });
    },
  });
}

export function useDeleteVenueImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ venueId, imageId }: { venueId: string; imageId: string }) =>
      api.delete(`/venues/${venueId}/images/${imageId}`),
    onSuccess: (_, { venueId }) => {
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, venueId, "images"] });
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, venueId] });
      qc.invalidateQueries({ queryKey: VENUES_KEY });
    },
  });
}

export function useReorderVenueImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      venueId,
      imageIds,
    }: {
      venueId: string;
      imageIds: string[];
    }) =>
      api
        .put<
          VenueImage[]
        >(`/venues/${venueId}/images/reorder`, { image_ids: imageIds })
        .then((r) => r.data),
    onSuccess: (_, { venueId }) => {
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, venueId, "images"] });
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, venueId] });
      qc.invalidateQueries({ queryKey: VENUES_KEY });
    },
  });
}

// ─── Venue Unavailability Queries & Mutations ─────────────────────────────────

export function useVenueUnavailabilities(venueId: string | null) {
  return useQuery({
    queryKey: [...VENUES_KEY, venueId, "unavailabilities"],
    queryFn: () => fetchVenueUnavailabilities(venueId!),
    enabled: !!venueId,
  });
}

const fetchVenueUnavailabilities = (venueId: string) =>
  api
    .get<VenueUnavailability[]>(`/venues/${venueId}/unavailabilities`)
    .then((r) => r.data);

export function useCreateVenueUnavailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      venueId,
      data,
    }: {
      venueId: string;
      data: VenueUnavailabilityCreate;
    }) =>
      api
        .post<VenueUnavailability>(`/venues/${venueId}/unavailabilities`, data)
        .then((r) => r.data),
    onSuccess: (_, { venueId }) => {
      qc.invalidateQueries({
        queryKey: [...VENUES_KEY, venueId, "unavailabilities"],
      });
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, venueId] });
    },
  });
}

export function useUpdateVenueUnavailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      venueId,
      unavailabilityId,
      data,
    }: {
      venueId: string;
      unavailabilityId: string;
      data: VenueUnavailabilityUpdate;
    }) =>
      api
        .patch<VenueUnavailability>(
          `/venues/${venueId}/unavailabilities/${unavailabilityId}`,
          data,
        )
        .then((r) => r.data),
    onSuccess: (_, { venueId }) => {
      qc.invalidateQueries({
        queryKey: [...VENUES_KEY, venueId, "unavailabilities"],
      });
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, venueId] });
    },
  });
}

export function useDeleteVenueUnavailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      venueId,
      unavailabilityId,
    }: {
      venueId: string;
      unavailabilityId: string;
    }) => api.delete(`/venues/${venueId}/unavailabilities/${unavailabilityId}`),
    onSuccess: (_, { venueId }) => {
      qc.invalidateQueries({
        queryKey: [...VENUES_KEY, venueId, "unavailabilities"],
      });
      qc.invalidateQueries({ queryKey: [...VENUES_KEY, venueId] });
    },
  });
}
