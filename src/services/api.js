const getApiBaseUrl = () => {
  // Use environment variable if set (recommended for production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Local development
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000/api";
  }
  // Production: use same protocol as the page (https) with /api proxy
  return "/api";
};

const API_BASE_URL = getApiBaseUrl();

function getHeaders() {
  const token = localStorage.getItem("bloodbridge_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || data.error || `HTTP error ${res.status}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Donor
  getDonorProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/donor/profile`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  updateDonorProfile: async (data) => {
    const res = await fetch(`${API_BASE_URL}/donor/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  getDonorNotifications: async () => {
    const res = await fetch(`${API_BASE_URL}/donor/notifications`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  respondToRequest: async (requestId, action) => {
    const res = await fetch(`${API_BASE_URL}/donor/requests/respond`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ request_id: requestId, action })
    });
    return handleResponse(res);
  },

  // Hospital
  getHospitalProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/hospital/profile`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  verifyHospitalSelf: async () => {
    const res = await fetch(`${API_BASE_URL}/hospital/verify-self`, {
      method: "POST",
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  createEmergencyRequest: async (requestData) => {
    const res = await fetch(`${API_BASE_URL}/hospital/requests`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(requestData)
    });
    return handleResponse(res);
  },

  getHospitalRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/hospital/requests`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getRequestMatches: async (requestId) => {
    const res = await fetch(`${API_BASE_URL}/hospital/requests/${requestId}/matches`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  fulfillRequest: async (requestId) => {
    const res = await fetch(`${API_BASE_URL}/hospital/requests/${requestId}/fulfill`, {
      method: "POST",
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  sendDonorAlert: async (data) => {
    const res = await fetch(`${API_BASE_URL}/hospital/send-alert`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Blood Bank API
  getBloodBankProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/blood-bank/profile`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  updateBloodBankInventory: async (inventory) => {
    const res = await fetch(`${API_BASE_URL}/blood-bank/inventory`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ inventory })
    });
    return handleResponse(res);
  },

  getBloodBankHospitalRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/blood-bank/hospital-requests`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  dispatchBloodBankDelivery: async (requestId) => {
    const res = await fetch(`${API_BASE_URL}/blood-bank/dispatch`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ request_id: requestId })
    });
    return handleResponse(res);
  },

  // Admin
  getPendingHospitals: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/hospitals/pending`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  verifyHospital: async (hospitalId, action) => {
    const res = await fetch(`${API_BASE_URL}/admin/hospitals/verify`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ hospital_id: hospitalId, action })
    });
    return handleResponse(res);
  },

  getAdminStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // AI & Demo
  getDemandPrediction: async () => {
    const res = await fetch(`${API_BASE_URL}/ai/predict-demand`);
    return handleResponse(res);
  },

  seedDemoData: async () => {
    const res = await fetch(`${API_BASE_URL}/seed`, {
      method: "POST",
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
