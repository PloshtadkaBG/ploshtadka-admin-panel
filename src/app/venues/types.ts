export type VenueStatus =
  | "active"
  | "inactive"
  | "maintenance"
  | "pending_approval";

export type SportType =
  | "football"
  | "basketball"
  | "tennis"
  | "volleyball"
  | "swimming"
  | "gym"
  | "padel"
  | "other";

export type VenueImage = {
  id: string;
  venue_id: string;
  url: string;
  is_thumbnail: boolean;
  order: number;
};

export type VenueImageCreate = {
  url: string;
  is_thumbnail?: boolean;
  order?: number;
};

export type VenueImageUpdate = {
  url?: string | null;
  is_thumbnail?: boolean | null;
  order?: number | null;
};

export type VenueUnavailability = {
  id: string;
  venue_id: string;
  start_datetime: string;
  end_datetime: string;
  reason: string | null;
};

export type VenueUnavailabilityCreate = {
  start_datetime: string;
  end_datetime: string;
  reason?: string | null;
};

export type VenueUnavailabilityUpdate = {
  start_datetime?: string | null;
  end_datetime?: string | null;
  reason?: string | null;
};

export type DayHours = {
  open: string;
  close: string;
};

export type WorkingHours = {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
};

export type Venue = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  sport_types: SportType[];
  address: string;
  city: string;
  latitude: string | null;
  longitude: string | null;
  price_per_hour: string;
  currency: string;
  capacity: number;
  is_indoor: boolean;
  has_parking: boolean;
  has_changing_rooms: boolean;
  has_showers: boolean;
  has_equipment_rental: boolean;
  amenities: string[];
  working_hours: WorkingHours | null;
  status: VenueStatus;
  rating: string;
  total_reviews: number;
  total_bookings: number;
  updated_at: string;
  images: VenueImage[];
  unavailabilities: VenueUnavailability[];
};

export type VenueListItem = {
  id: string;
  name: string;
  city: string;
  sport_types: SportType[];
  status: VenueStatus;
  price_per_hour: string;
  currency: string;
  capacity: number;
  is_indoor: boolean;
  rating: string;
  total_reviews: number;
  thumbnail: string | null;
};

export type VenueFormValues = {
  name: string;
  description: string;
  sport_types: SportType[];
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  price_per_hour: string;
  currency: string;
  capacity: number;
  is_indoor: boolean;
  has_parking: boolean;
  has_changing_rooms: boolean;
  has_showers: boolean;
  has_equipment_rental: boolean;
  amenities: string[];
  working_hours: WorkingHours;
};

export type VenueUpdate = Partial<VenueFormValues>;

export type VenueStatusUpdate = {
  status: VenueStatus;
};
