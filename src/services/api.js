const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000/api";
  }
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
    const res = await fetch(`${API_BASE_URL}/donors/profile`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  updateDonorProfile: async (data) => {
    const res = await fetch(`${API_BASE_URL}/donors/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  getDonorNotifications: async () => {
    const res = await fetch(`${API_BASE_URL}/donors/matches`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getDonorDonations: async () => {
    const res = await fetch(`${API_BASE_URL}/donors/donations`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  respondToMatch: async (matchId, response) => {
    const res = await fetch(`${API_BASE_URL}/donors/matches/${matchId}/respond`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ response })
    });
    return handleResponse(res);
  },

  // Hospital
  getHospitalProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/hospitals/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getAllHospitals: async () => {
    const res = await fetch(`${API_BASE_URL}/hospitals`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  updateHospitalInventory: async (bloodGroup, units, action = "set") => {
    const res = await fetch(`${API_BASE_URL}/hospitals/inventory`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ bloodGroup, units, action })
    });
    return handleResponse(res);
  },

  getHospitalTransfers: async () => {
    const res = await fetch(`${API_BASE_URL}/hospitals/transfers/my`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  acceptTransfer: async (transferId) => {
    const res = await fetch(`${API_BASE_URL}/hospitals/transfers/${transferId}/accept`, {
      method: "POST",
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Blood Requests
  createEmergencyRequest: async (requestData) => {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(requestData)
    });
    return handleResponse(res);
  },

  getRequests: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/requests${query ? `?${query}` : ""}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getHospitalRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getRequestDetails: async (requestId) => {
    const res = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  triggerMatching: async (requestId) => {
    const res = await fetch(`${API_BASE_URL}/requests/${requestId}/match`, {
      method: "POST",
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  confirmDonation: async (requestId, data) => {
    const res = await fetch(`${API_BASE_URL}/requests/${requestId}/confirm-donation`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Admin
  getPendingHospitals: async () => {
    const res = await fetch(`${API_BASE_URL}/hospitals`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  verifyHospital: async (hospitalId, action) => {
    const res = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}/verify`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ action })
    });
    return handleResponse(res);
  },

  getAdminStats: async () => {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Blood Bank (mapped to hospitals routes)
  getBloodBankProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/hospitals/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  updateBloodBankInventory: async (bloodGroup, units) => {
    const res = await fetch(`${API_BASE_URL}/hospitals/inventory`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ bloodGroup, units, action: "set" })
    });
    return handleResponse(res);
  },

  getBloodBankHospitalRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  dispatchBloodBankDelivery: async (requestId) => {
    const res = await fetch(`${API_BASE_URL}/requests/${requestId}/match`, {
      method: "POST",
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Demand prediction (health check fallback)
  getDemandPrediction: async () => {
    const res = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(res);
  },

  seedDemoData: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/seed`, {
      method: "POST",
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
