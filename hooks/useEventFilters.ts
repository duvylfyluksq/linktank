import { useCallback, useMemo, useState } from "react";

export const defaultEventFilters: EventFilter = {
  location_type: "all",
  locations: [],
  date_type: "upcoming",
  date: undefined,
  organization_id: "all",
};

export function useEventFilters(defaults: EventFilter = defaultEventFilters) {
  const [filterState, setFilterState] = useState<EventFilter>(defaults);

  const updateFilters = useCallback(
    <K extends keyof EventFilter>(
      keyOrUpdates: K | Partial<EventFilter>,
      value?: EventFilter[K]
    ) => {
      if (typeof keyOrUpdates === "string") {
        setFilterState((prev) => ({
          ...prev,
          [keyOrUpdates]: value!,
        }));
      } else {
        setFilterState((prev) => ({
          ...prev,
          ...keyOrUpdates,
        }));
      }
    },
    []
  );

  return useMemo(
    () => ({
      ...filterState,
      updateFilters,
    }),
    [filterState, updateFilters]
  );
}
