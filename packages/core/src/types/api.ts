export interface ApiResponse {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
}

export type ApiRouteHandler = (
  params: Record<string, string>,
  body: unknown,
  headers: Record<string, string>,
) => Promise<ApiResponse>;

export interface ApiRoute {
  /**
   * The type of endpoint.
   * "EVAL" is for evaluation of feature flags, public by default.
   * "ADMIN" is for management of flags, segments and overrides, private by default.
   */
  type: "EVAL" | "ADMIN";
  path: string;
  /**
   * HTTP method (uppercase)
   */
  method: "GET" | "POST" | "PUT" | "DELETE";
  /**
   * Wraps some a LibreFlag function and represents it as an API route.
   * Takes request body, params and headers and returns a response-like object that can be parsed to the appropriate response object for the chosen framework.
   */
  handler: ApiRouteHandler;
}
