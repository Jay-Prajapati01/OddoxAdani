import { useEffect, useState, useCallback } from "react";
import { useDemo } from "@/contexts/DemoContext";
import { UserRole } from "@/contexts/AuthContext";

interface UseRoleSyncOptions {
  onRoleChange?: (newRole: UserRole | null, previousRole: UserRole | null) => void;
}

export function useRoleSync(options: UseRoleSyncOptions = {}) {
  const { getEffectiveRole, isPreviewActive } = useDemo();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(getEffectiveRole());
  const [previousRole, setPreviousRole] = useState<UserRole | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const effectiveRole = getEffectiveRole();
    
    if (effectiveRole !== currentRole) {
      setIsTransitioning(true);
      setPreviousRole(currentRole);
      
      // Small delay to allow exit animation
      const timer = setTimeout(() => {
        setCurrentRole(effectiveRole);
        options.onRoleChange?.(effectiveRole, currentRole);
        
        // End transition after enter animation
        setTimeout(() => setIsTransitioning(false), 300);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [getEffectiveRole, currentRole, options]);

  return {
    currentRole,
    previousRole,
    isTransitioning,
    isPreviewActive,
  };
}

export function useRealTimeUpdates() {
  const { getEffectiveRole, isPreviewActive, previewRole, actualRole } = useDemo();
  const [updateKey, setUpdateKey] = useState(0);

  // Force re-render when role changes
  useEffect(() => {
    setUpdateKey((prev) => prev + 1);
  }, [previewRole, actualRole]);

  const forceUpdate = useCallback(() => {
    setUpdateKey((prev) => prev + 1);
  }, []);

  return {
    updateKey,
    effectiveRole: getEffectiveRole(),
    isPreviewActive,
    forceUpdate,
  };
}
