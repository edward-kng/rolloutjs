import type { Store } from "./types/store.js";
import type { LibreFlagServer } from "./types/server.js";
import { createApiRoutes } from "./utils/api.js";
import { createEvaluationService } from "./services/evaluation.js";
import { createFlagService } from "./services/flags.js";
import { createOverrideService } from "./services/overrides.js";
import { createSegmentService } from "./services/segments.js";

export function LibreFlag(store: Store): LibreFlagServer {
  const server = {
    ...createEvaluationService(store),
    ...createFlagService(store),
    ...createOverrideService(store),
    ...createSegmentService(store),
  };

  return {
    ...server,
    routes: createApiRoutes(server, store),
  };
}
