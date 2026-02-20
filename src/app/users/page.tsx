"use client";

import { BaseLayout } from "@/components/layouts/base-layout";
import { StatCards } from "./components/stat-cards";
import { DataTable } from "./components/data-table";
import { useAddUser, useDeleteUser, useUpdateScopes, useUsers } from "./hooks";

export default function UsersPage() {
  const { data: users = [], isLoading } = useUsers();
  const { mutate: addUser } = useAddUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateScopes } = useUpdateScopes();

  return (
    <BaseLayout
      title="Users"
      description="Manage your users and their permissions"
    >
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6">
          <StatCards users={users} loading={isLoading} />
        </div>
        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
          <DataTable
            users={users}
            loading={isLoading}
            onAddUser={addUser}
            onDeleteUser={deleteUser}
            onUpdateScopes={(id, scopes) => updateScopes({ id, scopes })}
          />
        </div>
      </div>
    </BaseLayout>
  );
}
