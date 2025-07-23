import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Async thunks for API calls
export const fetchShipments = createAsyncThunk(
  'shipments/fetchShipments',
  async ({ page = 1, limit = 10, status = '', containerId = '' } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (status) params.append('status', status);
    if (containerId) params.append('containerId', containerId);

    const response = await axios.get(`${API_BASE_URL}/shipments?${params}`);
    return response.data;
  }
);

export const fetchShipmentById = createAsyncThunk(
  'shipments/fetchShipmentById',
  async (id) => {
    const response = await axios.get(`${API_BASE_URL}/shipments/${id}`);
    return response.data;
  }
);

export const createShipment = createAsyncThunk(
  'shipments/createShipment',
  async (shipmentData) => {
    const response = await axios.post(`${API_BASE_URL}/shipments`, shipmentData);
    return response.data;
  }
);

export const updateShipmentLocation = createAsyncThunk(
  'shipments/updateShipmentLocation',
  async ({ id, locationData }) => {
    const response = await axios.post(`${API_BASE_URL}/shipments/${id}/update-location`, locationData);
    return response.data;
  }
);

export const fetchShipmentETA = createAsyncThunk(
  'shipments/fetchShipmentETA',
  async (id) => {
    const response = await axios.get(`${API_BASE_URL}/shipments/${id}/eta`);
    return response.data;
  }
);

export const updateShipment = createAsyncThunk(
  'shipments/updateShipment',
  async ({ id, shipmentData }) => {
    const response = await axios.put(`${API_BASE_URL}/shipments/${id}`, shipmentData);
    return response.data;
  }
);

export const deleteShipment = createAsyncThunk(
  'shipments/deleteShipment',
  async (id) => {
    await axios.delete(`${API_BASE_URL}/shipments/${id}`);
    return id;
  }
);

const initialState = {
  shipments: [],
  currentShipment: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,
  filters: {
    status: '',
    containerId: '',
  },
  eta: null,
};

const shipmentSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentShipment: (state) => {
      state.currentShipment = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { status: '', containerId: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch shipments
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = action.payload.shipments;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch shipment by ID
      .addCase(fetchShipmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShipment = action.payload;
      })
      .addCase(fetchShipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create shipment
      .addCase(createShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update shipment location
      .addCase(updateShipmentLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipmentLocation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shipments.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.shipments[index] = action.payload;
        }
        if (state.currentShipment && state.currentShipment._id === action.payload._id) {
          state.currentShipment = action.payload;
        }
      })
      .addCase(updateShipmentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch ETA
      .addCase(fetchShipmentETA.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchShipmentETA.fulfilled, (state, action) => {
        state.eta = action.payload;
      })
      .addCase(fetchShipmentETA.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      // Update shipment
      .addCase(updateShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shipments.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.shipments[index] = action.payload;
        }
        if (state.currentShipment && state.currentShipment._id === action.payload._id) {
          state.currentShipment = action.payload;
        }
      })
      .addCase(updateShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Delete shipment
      .addCase(deleteShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = state.shipments.filter(s => s._id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearCurrentShipment, setFilters, clearFilters } = shipmentSlice.actions;

export default shipmentSlice.reducer;
