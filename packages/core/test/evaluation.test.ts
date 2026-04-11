import { describe, expect, test, vi } from "vitest";
import { createMockStore } from "./utils/store";
import { LibreFlag } from "../src/libreflag";
import {
  FlagNotFoundError,
  StandardResolutionReasons,
} from "@openfeature/core";
import { isMember } from "../src/utils/segments";
import { mockContext, mockFlags, mockSegments } from "./fixtures/evaluation";

vi.mock(import("../src/utils/segments"), () => ({
  isMember: vi.fn(),
}));

describe("evaluate", () => {
  test("throws NotFoundError if flag doesn't exist", () => {
    const libreFlag = LibreFlag(createMockStore());

    expect(libreFlag.evaluate(mockFlags[0].key)).rejects.toThrow(
      FlagNotFoundError,
    );
  });

  test.each(["Hello world!", true, { defaultTheme: "dark" }, 42])(
    "returns default value if there are no overrides",
    async (defaultValue) => {
      const flagKey = mockFlags[0].key;

      const store = createMockStore();
      const libreFlag = LibreFlag(store);
      store.getFlag = vi.fn().mockResolvedValue({
        key: flagKey,
        defaultValue,
      });
      const result = await libreFlag.evaluate(flagKey);

      expect(result.key).toEqual(flagKey);
      expect(result.reason).toEqual(StandardResolutionReasons.STATIC);
      expect(result.value).toEqual(defaultValue);
      expect(result.errorCode, result.errorDetails).toBeUndefined();
    },
  );

  test.each([
    ["Hello world!", "Hello Universe!"],
    [false, true],
    [1024, 2048],
    [{ defaultTheme: "dark" }, { defaultTheme: "light" }],
  ])(
    "returns segment override if user is in segment",
    async (defaultValue, segmentValue) => {
      const flagKey = mockFlags[0].key;
      const segmentKey = mockSegments[0].key;
      const targetingKey = mockContext.targetingKey;
      const store = createMockStore();
      const libreFlag = LibreFlag(store);
      store.getFlag = vi.fn().mockResolvedValue({
        key: flagKey,
        defaultValue,
      });
      store.listSegments = vi.fn().mockResolvedValue([{ key: segmentKey }]);
      store.getSegmentOverridesForFlag = vi
        .fn()
        .mockResolvedValue([{ segmentKey, value: segmentValue }]);
      vi.mocked(isMember).mockReturnValue(true);
      const result = await libreFlag.evaluate(flagKey, {
        targetingKey,
      });

      expect(result.key).toEqual(flagKey);
      expect(result.reason).toEqual(StandardResolutionReasons.TARGETING_MATCH);
      expect(result.value).toEqual(segmentValue);
      expect(result.errorCode, result.errorDetails).toBeUndefined();
    },
  );

  test.each([
    ["Hello world!", "Hello Universe!", "Hello galaxy!"],
    [false, false, true],
    [1024, 512, 2048],
    [
      { defaultTheme: "dark" },
      { defaultTheme: "auto" },
      { defaultTheme: "light" },
    ],
  ])(
    "returns user override if user is in segment with override, but user override exists",
    async (defaultValue, segmentValue, userValue) => {
      const flagKey = mockFlags[0].key;
      const targetingKey = mockContext.targetingKey;
      const segmentKey = mockSegments[0].key;
      const store = createMockStore();
      const libreFlag = LibreFlag(store);
      store.getFlag = vi.fn().mockResolvedValue({
        key: flagKey,
        defaultValue,
      });
      store.listSegments = vi.fn().mockResolvedValue([{ key: segmentKey }]);
      store.getSegmentOverridesForFlag = vi
        .fn()
        .mockResolvedValue([{ segmentKey, value: segmentValue }]);
      vi.mocked(isMember).mockReturnValue(true);
      store.getUserOverride = vi.fn().mockResolvedValue({
        value: userValue,
      });
      const result = await libreFlag.evaluate(flagKey, {
        targetingKey,
      });

      expect(result.key).toEqual(flagKey);
      expect(result.reason).toEqual(StandardResolutionReasons.TARGETING_MATCH);
      expect(result.value).toEqual(userValue);
      expect(result.errorCode, result.errorDetails).toBeUndefined();
    },
  );

  test.each([
    ["Hello world!", "Hello Universe!"],
    [false, true],
    [1024, 2048],
    [{ defaultTheme: "dark" }, { defaultTheme: "light" }],
  ])(
    "returns default value if user is not in segment",
    async (defaultValue, segmentValue) => {
      const flagKey = mockFlags[0].key;
      const targetingKey = mockContext.targetingKey;
      const segmentKey = mockSegments[0].key;
      const store = createMockStore();
      const libreFlag = LibreFlag(store);
      store.getFlag = vi.fn().mockResolvedValue({
        key: flagKey,
        defaultValue,
      });
      store.listSegments = vi.fn().mockResolvedValue([{ key: segmentKey }]);
      store.getSegmentOverridesForFlag = vi
        .fn()
        .mockResolvedValue([{ segmentKey, value: segmentValue }]);
      vi.mocked(isMember).mockReturnValue(false);
      const result = await libreFlag.evaluate(flagKey, {
        targetingKey,
      });

      expect(result.key).toEqual(flagKey);
      expect(result.reason).toEqual(StandardResolutionReasons.STATIC);
      expect(result.value).toEqual(defaultValue);
      expect(result.errorCode, result.errorDetails).toBeUndefined();
    },
  );

  test.each([
    ["Hello world!", "Hello Universe!", "Hello galaxy!"],
    [false, false, true],
    [1024, 512, 2048],
    [
      { defaultTheme: "dark" },
      { defaultTheme: "auto" },
      { defaultTheme: "light" },
    ],
  ])(
    "returns highest priority segment override",
    async (defaultValue, firstSegmentValue, secondSegmentValue) => {
      const flagKey = mockFlags[0].key;
      const targetingKey = mockContext.targetingKey;

      const store = createMockStore();
      const libreFlag = LibreFlag(store);
      store.getFlag = vi.fn().mockResolvedValue({
        key: flagKey,
        defaultValue,
      });
      store.listSegments = vi
        .fn()
        .mockResolvedValue([
          { key: mockSegments[1].key },
          { key: mockSegments[0].key },
        ]);
      store.getSegmentOverridesForFlag = vi.fn().mockResolvedValue([
        { segmentKey: mockSegments[0].key, value: firstSegmentValue },
        { segmentKey: mockSegments[1].key, value: secondSegmentValue },
      ]);
      vi.mocked(isMember).mockReturnValue(true);
      const result = await libreFlag.evaluate(flagKey, {
        targetingKey,
      });

      expect(result.key).toEqual(flagKey);
      expect(result.reason).toEqual(StandardResolutionReasons.TARGETING_MATCH);
      expect(result.value).toEqual(secondSegmentValue);
      expect(result.errorCode, result.errorDetails).toBeUndefined();
    },
  );
});

describe("evaluateAll", () => {
  test.each([
    [
      ["Hello universe!", null, null, null],
      [null, true, null, null],
    ],
    [
      [null, true, null, null],
      [null, null, 2048, null],
    ],
    [
      [null, null, 512, null],
      [null, null, null, { defaultTheme: "auto" }],
    ],
    [
      [null, null, null, { defaultTheme: "light" }],
      ["Hello galaxy!", true, null, null],
    ],
    [
      ["Hello universe!", true, null, null],
      [null, null, 512, null],
    ],
    [
      ["Hello universe!", true, null, null],
      ["Hello galaxy!", null, 512, null],
    ],
  ])(
    "returns all flag values with overrides if present",
    async (userOverrides, segmentOverrides) => {
      const targetingKey = mockContext.targetingKey;
      const segmentKey = mockSegments[0].key;
      const store = createMockStore();
      const libreFlag = LibreFlag(store);
      store.listFlags = vi.fn().mockResolvedValue(mockFlags);
      store.getUserOverrides = vi.fn().mockResolvedValue(
        userOverrides
          .map((override, i) => ({
            flagKey: mockFlags[i].key,
            targetingKey,
            value: override,
          }))
          .filter((override) => override.value !== null),
      );
      store.listSegments = vi.fn().mockResolvedValue([{ key: segmentKey }]);
      store.listSegmentOverrides = vi.fn().mockResolvedValue(
        segmentOverrides
          .map((override, i) => ({
            flagKey: mockFlags[i].key,
            segmentKey,
            value: override,
          }))
          .filter((override) => override.value !== null),
      );
      vi.mocked(isMember).mockReturnValue(true);

      const results = await libreFlag.evaluateAll(mockContext);

      expect(results.length).toEqual(mockFlags.length);

      results.forEach((result, i) => {
        expect(result.key).toEqual(mockFlags[i].key);
        expect(result.reason).toEqual(
          userOverrides[i] === null && segmentOverrides[i] === null
            ? StandardResolutionReasons.STATIC
            : StandardResolutionReasons.TARGETING_MATCH,
        );
        expect(result.value).toEqual(
          userOverrides[i] ?? segmentOverrides[i] ?? mockFlags[i].defaultValue,
        );
        expect(result.errorCode, result.errorDetails).toBeUndefined();
      });
    },
  );

  test.each([
    [
      ["Hello universe!", null, null, null],
      [null, true, null, null],
    ],
    [
      [null, true, null, null],
      [null, null, 2048, null],
    ],
    [
      [null, null, 512, null],
      [null, null, null, { defaultTheme: "auto" }],
    ],
    [
      [null, null, null, { defaultTheme: "light" }],
      ["Hello galaxy!", true, null, null],
    ],
    [
      ["Hello universe!", true, null, null],
      [null, null, 512, null],
    ],
    [
      ["Hello universe!", true, null, null],
      ["Hello galaxy!", null, 512, null],
    ],
  ])(
    "returns overrides for multiple segments if present",
    async (firstSegmentOverrides, secondSegmentOverrides) => {
      const store = createMockStore();
      const libreFlag = LibreFlag(store);
      store.listFlags = vi.fn().mockResolvedValue(mockFlags);
      store.listSegments = vi.fn().mockResolvedValue(mockSegments);
      store.listSegmentOverrides = vi.fn().mockResolvedValue(
        [firstSegmentOverrides, secondSegmentOverrides].flatMap(
          (overrides, segmentIndex) =>
            overrides
              .map((override, i) => ({
                flagKey: mockFlags[i].key,
                segmentKey: mockSegments[segmentIndex].key,
                value: override,
              }))
              .filter((override) => override.value !== null),
        ),
      );
      vi.mocked(isMember).mockReturnValue(true);

      const results = await libreFlag.evaluateAll(mockContext);

      expect(results.length).toEqual(mockFlags.length);

      results.forEach((result, i) => {
        expect(result.key).toEqual(mockFlags[i].key);
        expect(result.reason).toEqual(
          firstSegmentOverrides[i] === null &&
            secondSegmentOverrides[i] === null
            ? StandardResolutionReasons.STATIC
            : StandardResolutionReasons.TARGETING_MATCH,
        );
        expect(result.value).toEqual(
          firstSegmentOverrides[i] ??
            secondSegmentOverrides[i] ??
            mockFlags[i].defaultValue,
        );
        expect(result.errorCode, result.errorDetails).toBeUndefined();
      });
    },
  );
});
