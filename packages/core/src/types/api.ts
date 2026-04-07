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
  type: "EVAL" | "ADMIN";
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  handler: ApiRouteHandler;
}
