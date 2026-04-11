import { vi } from "vitest";
import { Store } from "../../src/types/store";

export function createMockStore(): Store {
  const partialStore = {
    migrate: vi.fn(),
    getConfigVersion: vi.fn(),
    incrementConfigVersion: vi.fn(),

    listFlags: vi.fn().mockResolvedValue([]),
    getFlag: vi.fn().mockResolvedValue(null),
    createFlag: vi.fn(),
    updateFlag: vi.fn(),
    deleteFlag: vi.fn(),

    listOverrides: vi.fn().mockResolvedValue([]),
    getFlagOverrides: vi.fn().mockResolvedValue([]),
    getUserOverrides: vi.fn().mockResolvedValue([]),
    getUserOverride: vi.fn(),
    setUserOverride: vi.fn(),
    deleteUserOverride: vi.fn(),
    listSegmentOverrides: vi.fn().mockResolvedValue([]),
    getSegmentOverrides: vi.fn().mockResolvedValue([]),
    getSegmentOverridesForFlag: vi.fn().mockResolvedValue([]),
    setSegmentOverride: vi.fn(),
    deleteSegmentOverride: vi.fn(),

    listSegments: vi.fn().mockResolvedValue([]),
    createSegment: vi.fn(),
    updateSegment: vi.fn(),
    deleteSegment: vi.fn(),
    getMaxSegmentPriority: vi.fn(),
    getSegmentPriorityByIndex: vi.fn(),
  };

  return {
    transaction: async (fn) => {
      fn(partialStore);
    },
    ...partialStore,
  };
}
