const API_URL = `${process.env.API_URL}`;

export const api = {
  async post(url: string, data: unknown) {
    const response = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return response.json();
  },
  async postFormData(url: string, data: FormData) {
    return fetch(`${API_URL}${url}`, {
      method: "POST",
      body: data,
    });
  },
  async get(url: string) {
    const response = await fetch(`${API_URL}${url}`, {
      credentials: "include",
    });
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    if (isJson) {
      return response.json();
    }
    return null;
  },
  async delete(url: string) {
    await fetch(`${API_URL}${url}`, {
      method: "DELETE",
      credentials: "include",
    });
  },
};
