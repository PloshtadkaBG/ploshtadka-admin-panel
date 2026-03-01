"use client";

import { BaseLayout } from "@/components/layouts/base-layout";
import { StatCards } from "./components/stat-cards";
import { BookingsTrendChart } from "./components/bookings-trend-chart";
import { RecentBookingsTable } from "./components/recent-bookings-table";
import { useMe } from "@/app/auth/api/hooks";
import { useVenues } from "@/app/venues/hooks";
import { useBookings } from "@/app/bookings/hooks";
import { useUsers } from "@/app/auth/api/hooks";
import { isAdmin, isVenueOwner } from "@/lib/scopes";

export default function Page() {
  const { data: me } = useMe();
  const admin = me ? isAdmin(me.scopes) : false;
  const owner = me ? isVenueOwner(me.scopes) : false;

  const venueParams =
    owner && me ? { owner_id: String(me.id) } : undefined;
  const { data: venues = [], isLoading: venuesLoading } =
    useVenues(venueParams);
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { data: users = [], isLoading: usersLoading } = useUsers(admin);

  const loading = venuesLoading || bookingsLoading;

  return (
    <BaseLayout
      title="Табло"
      description={
        admin
          ? "Преглед на платформата"
          : "Преглед на вашия бизнес"
      }
    >
      <div className="space-y-6 px-4 lg:px-6">
        <StatCards
          venues={venues}
          bookings={bookings}
          userCount={users.length}
          loading={loading}
          usersLoading={usersLoading}
          isAdmin={admin}
        />
        <BookingsTrendChart bookings={bookings} loading={bookingsLoading} />
        <RecentBookingsTable
          bookings={bookings}
          loading={bookingsLoading}
          isAdmin={admin}
        />
      </div>
    </BaseLayout>
  );
}
