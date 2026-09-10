import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/agency-login")({
  component: function AgencyLoginRedirect() {
    return <Navigate to="/kse-ops" replace />;
  },
});
