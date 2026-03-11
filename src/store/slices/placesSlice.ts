import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  image: string;
  images?: string[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  hours?: string;
  price?: string;
  transport?: string;
}

interface PlacesState {
  items: Place[];
  loading: boolean;
  error: string | null;
}

const initialState: PlacesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchPlaces = createAsyncThunk('places/fetchPlaces', async () => {
  const response = await api.get('/places');
  return response.data;
});

export const createPlace = createAsyncThunk('places/createPlace', async (place: Omit<Place, 'id' | 'createdAt'> & { createdAt?: string }) => {
  const response = await api.post('/places', place);
  return response.data;
});

export const updatePlace = createAsyncThunk('places/updatePlace', async (place: Place) => {
  const response = await api.put(`/places/${place.id}`, place);
  return response.data;
});

export const deletePlace = createAsyncThunk('places/deletePlace', async (id: string) => {
  await api.delete(`/places/${id}`);
  return id;
});

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch places';
      })
      .addCase(createPlace.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePlace.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deletePlace.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export default placesSlice.reducer;
