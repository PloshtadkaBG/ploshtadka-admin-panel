"use client";

import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes, type RouteConfig } from "@/config/routes";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProtectedRoute } from "../protected-route";

function renderRoutes(routeConfigs: RouteConfig[]) {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        {routeConfigs
          .filter((v) => !v.isPublic)
          .map((route, index) => (
            <Route
              key={route.path + index}
              path={route.path}
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  {route.element}
                </Suspense>
              }
            >
              {route.children && renderRoutes(route.children)}
            </Route>
          ))}
      </Route>
      {routeConfigs
        .filter((v) => v.isPublic)
        .map((route, index) => (
          <Route
            key={route.path + index}
            path={route.path}
            element={
              <Suspense fallback={<LoadingSpinner />}>{route.element}</Suspense>
            }
          >
            {route.children && renderRoutes(route.children)}
          </Route>
        ))}
    </Routes>
  );
}

export function AppRouter() {
  return renderRoutes(routes);
}
