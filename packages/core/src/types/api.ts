export interface ApiResponse<T extends object | undefined = undefined> {
  status: number;
  body?: T | string | undefined;
  etag?: string;
}
