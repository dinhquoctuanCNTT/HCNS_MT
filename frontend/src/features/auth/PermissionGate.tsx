import { hasMinRole } from "./auth.permissions";
import { useAuthStore } from "./auth.store";

interface PermissionGateProps {
  minRole?: string;
  check?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export default function PermissionGate({
  minRole,
  check,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { role } = useAuthStore();

  const allowed =
    check !== undefined ? check : hasMinRole(role, minRole ?? "employee");

  return allowed ? <>{children}</> : <>{fallback}</>;
}

export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  gate: { minRole?: string; check?: boolean; fallback?: React.ReactNode },
) {
  return function GuardedComponent(props: P) {
    return (
      <PermissionGate {...gate}>
        <Component {...props} />
      </PermissionGate>
    );
  };
}
