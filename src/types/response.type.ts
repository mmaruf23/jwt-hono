import type { ContentfulStatusCode } from 'hono/utils/http-status';

interface SuccessResponse<T> {
  success: true;
  code: ContentfulStatusCode;
  data?: T;
}

interface ErrorResponse {
  success: false;
  code: ContentfulStatusCode;
  message: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
