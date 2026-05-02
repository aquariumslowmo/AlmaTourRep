const API_CONFIG = {
  // For local development with your FastAPI backend run at 127.0.0.1:8000
  BASE_URL: "https://almatourback.onrender.com",

  ENDPOINTS: {
    LOGIN: "/auth/login",

    LIST_TOURS: "/tours",
    CREATE_TOUR: "/tours",
    UPDATE_TOUR: (id) => `/tours/${id}`,

    CREATE_BOOKING: "/bookings",
    MY_BOOKINGS: "/bookings/me",

    H3_ANALYTICS: "/analytics/h3",

    AUDIT_LOG: "/admin/audit-log",
  },

  TIMEOUT: 10000,

  STORAGE_KEYS: {
    TOKEN: "almatour_token",
    USER: "almatour_user",
    SESSION: "almatour_session",
  },
};

class ApiClient {
  constructor(config = API_CONFIG) {
    this.config = config;
    this.token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
  }

  async request(method, endpoint, data = null, options = {}) {
    const url = this.config.BASE_URL + endpoint;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const fetchOptions = {
      method,
      headers,
      timeout: this.config.TIMEOUT,
      ...options,
    };

    if (data) {
      fetchOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, fetchOptions);

      if (response.status === 401) {
        localStorage.removeItem(this.config.STORAGE_KEYS.TOKEN);
        window.location.href = "auth.html";
        return null;
      }

      if (!response.ok) {
        const error = await response.text();
        console.error(`API Error [${response.status}]: ${error}`);
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request("GET", endpoint, null, options);
  }

  async post(endpoint, data = null, options = {}) {
    return this.request("POST", endpoint, data, options);
  }

  async patch(endpoint, data = null, options = {}) {
    return this.request("PATCH", endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this.request("DELETE", endpoint, null, options);
  }

  async login(email, password) {
    try {
      const response = await this.post(this.config.ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (response && response.token) {
        this.token = response.token;
        localStorage.setItem(this.config.STORAGE_KEYS.TOKEN, response.token);
        localStorage.setItem(
          this.config.STORAGE_KEYS.USER,
          JSON.stringify(response)
        );
        return response;
      }
      throw new Error("No token in response: " + JSON.stringify(response));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(name, email, password) {
  try {
    const response = await this.post('/auth/register', { name, email, password });
    if (response && response.token) {
      this.token = response.token;
      localStorage.setItem(this.config.STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(this.config.STORAGE_KEYS.USER, JSON.stringify(response));
      localStorage.setItem(this.config.STORAGE_KEYS.SESSION, JSON.stringify({
        token: response.token,
        role: response.role,
        name: response.name,
      }));
      return response;
    }
    throw new Error('No token in response');
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

  logout() {
    this.token = null;
    localStorage.removeItem(this.config.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(this.config.STORAGE_KEYS.USER);
  }

  isAuthenticated() {
    return !!this.token;
  }

  async listTours(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint =
      this.config.ENDPOINTS.LIST_TOURS + (queryString ? `?${queryString}` : "");
    return this.get(endpoint);
  }

  async createTour(tourData) {
    return this.post(this.config.ENDPOINTS.CREATE_TOUR, tourData);
  }

  async updateTour(tourId, tourData) {
    return this.patch(
      this.config.ENDPOINTS.UPDATE_TOUR(tourId),
      tourData
    );
  }

  async createBooking(bookingData) {
    return this.post(this.config.ENDPOINTS.CREATE_BOOKING, bookingData);
  }

  async getMyBookings() {
    return this.get(this.config.ENDPOINTS.MY_BOOKINGS);
  }

  async getH3Analytics() {
    return this.get(this.config.ENDPOINTS.H3_ANALYTICS);
  }

  async getAuditLog(limit = 50) {
    return this.get(`${this.config.ENDPOINTS.AUDIT_LOG}?limit=${limit}`);
  }
}

const api = new ApiClient();
window.API_CONFIG = API_CONFIG;
window.ApiClient = ApiClient;
window.api = api;

