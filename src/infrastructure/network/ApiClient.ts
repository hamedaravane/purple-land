export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export class ApiClient {
  constructor(private baseUrl: string) {}

  /**
   * GET request, typed to return ApiResponse<T>.
   */
  async get<T>(path: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, { method: "GET" });
    const json = (await response.json()) as ApiResponse<T>;
    if (!response.ok || !json.success) {
      throw new Error(json.error || `GET ${path} failed.`);
    }
    return json;
  }

  /**
   * POST request, typed to accept input data I, and return ApiResponse<O>.
   */
  async post<I, O>(path: string, data: I): Promise<ApiResponse<O>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = (await response.json()) as ApiResponse<O>;
    if (!response.ok || !json.success) {
      throw new Error(json.error || `POST ${path} failed.`);
    }
    return json;
  }

  /**
   * Additional methods (PUT, PATCH, DELETE) can follow the same pattern.
   */
}