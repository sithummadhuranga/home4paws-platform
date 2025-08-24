// src/app/admin/layout.tsx
// Update the import path to the correct location of ProtectedRoute
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { ReactNode } from "react";

// This component protects all child routes under /admin
export default function AdminLayout({ children }: { children: ReactNode }) {
  // Your ProtectedRoute will likely use your AuthContext to check the user's role.
  // We are specifying that the required role is "Admin".
  return (
    <ProtectedRoute requiredRole="Admin">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4">Admin Dashboard</h1>
        {children}
      </div>
    </ProtectedRoute>
  );
}