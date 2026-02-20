import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Clock5, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { User } from "../types";

interface StatCardsProps {
  users: User[];
  loading: boolean;
}

export function StatCards({ users, loading }: StatCardsProps) {
  const total = users.length;
  const active = users.filter((u) => u.is_active).length;
  const inactive = users.filter((u) => !u.is_active).length;
  // const withScopes = users.filter(
  //   (u) => u.scopes && u.scopes.length > 0,
  // ).length;

  const metrics = [
    {
      title: "Total Users",
      value: loading ? "…" : total,
      icon: Users,
      badge: null,
    },
    {
      title: "Active Users",
      value: loading ? "…" : active,
      icon: UserCheck,
      badge: total > 0 ? `${Math.round((active / total) * 100)}%` : null,
      badgeGreen: true,
    },
    {
      title: "Inactive Users",
      value: loading ? "…" : inactive,
      icon: Clock5,
      badge: total > 0 ? `${Math.round((inactive / total) * 100)}%` : null,
      badgeGreen: false,
    },
    // {
    //   title: "With Scopes",
    //   value: loading ? "…" : withScopes,
    //   icon: TrendingUp,
    //   badge: null,
    // },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index} className="border">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <metric.icon className="text-muted-foreground size-6" />
              {metric.badge && (
                <Badge
                  variant="outline"
                  className={
                    metric.badgeGreen
                      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400"
                  }
                >
                  {metric.badge}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                {metric.title}
              </p>
              <div className="text-2xl font-bold">{metric.value}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
