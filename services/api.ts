const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

if (!API_URL) {
  throw new Error(
    "EXPO_PUBLIC_API_URL não foi definida. Verifique o arquivo .env do projeto.",
  );
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  token?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

type ApiErrorResponse = {
  message?: string;
  [key: string]: unknown;
};

export class ApiError extends Error {
  status: number;
  data: ApiErrorResponse | null;

  constructor(
    message: string,
    status: number,
    data: ApiErrorResponse | null = null,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function parseResponse(response: Response): Promise<unknown> {
  // Resposta sem conteúdo
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  // Resposta JSON
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  // Resposta em texto
  const text = await response.text();

  return text || null;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    token,
    body,
    headers = {},
  } = options;

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const requestUrl = `${API_URL}${normalizedEndpoint}`;

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  // LOGS TEMPORÁRIOS PARA TESTAR A CONEXÃO
  console.log("========== API REQUEST ==========");
  console.log("API_URL:", API_URL);
  console.log("ENDPOINT:", normalizedEndpoint);
  console.log("REQUEST URL:", requestUrl);
  console.log("METHOD:", method);

  if (body !== undefined) {
    console.log("BODY:", body);
  }

  console.log("=================================");

  let response: Response;

  try {
    response = await fetch(requestUrl, {
      method,
      headers: requestHeaders,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  } catch (error) {
    console.error("========== ERRO FETCH ==========");
    console.error("URL:", requestUrl);
    console.error("ERRO:", error);
    console.error("===============================");

    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
      0,
    );
  }

  console.log("========== API RESPONSE ==========");
  console.log("STATUS:", response.status);
  console.log("OK:", response.ok);
  console.log("URL:", requestUrl);
  console.log("==================================");

  let data: unknown;

  try {
    data = await parseResponse(response);
  } catch (error) {
    console.error("Erro ao processar resposta da API:", error);

    throw new ApiError(
      "O servidor retornou uma resposta inválida.",
      response.status,
    );
  }

  if (!response.ok) {
    const errorData =
      data && typeof data === "object"
        ? (data as ApiErrorResponse)
        : null;

    const message =
      errorData?.message ??
      `Erro na requisição (${response.status}).`;

    console.error("========== ERRO API ==========");
    console.error("STATUS:", response.status);
    console.error("RESPOSTA:", data);
    console.error("==============================");

    throw new ApiError(
      message,
      response.status,
      errorData,
    );
  }

  return data as T;
}

async function get<T>(
  endpoint: string,
  token?: string,
): Promise<T> {
  return request<T>(endpoint, {
    method: "GET",
    token,
  });
}

async function post<T>(
  endpoint: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  return request<T>(endpoint, {
    method: "POST",
    body,
    token,
  });
}

async function put<T>(
  endpoint: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  return request<T>(endpoint, {
    method: "PUT",
    body,
    token,
  });
}

async function patch<T>(
  endpoint: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  return request<T>(endpoint, {
    method: "PATCH",
    body,
    token,
  });
}

async function remove<T = null>(
  endpoint: string,
  token?: string,
): Promise<T> {
  return request<T>(endpoint, {
    method: "DELETE",
    token,
  });
}

export const api = {
  get,
  post,
  put,
  patch,
  delete: remove,
};

export { API_URL };