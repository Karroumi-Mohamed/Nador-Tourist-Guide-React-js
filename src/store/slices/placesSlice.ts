import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export type PlaceCategory =
    | 'plages'
    | 'sites-naturels'
    | 'monuments-patrimoine'
    | 'musees-culture'
    | 'restaurants'
    | 'hotels-hebergements'
    | 'cafes-salons-the'
    | 'shopping-souks'
    | 'loisirs-divertissements';

export type TransportMode = 'bus' | 'taxi' | 'car' | 'walk';

export interface TimeSlot {
    open: string; // Format: "HH:MM"
    close: string; // Format: "HH:MM"
}

export interface OpeningHours {
    monday?: TimeSlot;
    tuesday?: TimeSlot;
    wednesday?: TimeSlot;
    thursday?: TimeSlot;
    friday?: TimeSlot;
    saturday?: TimeSlot;
    sunday?: TimeSlot;
}

export interface Place {
    id: string;
    name: string;
    category: PlaceCategory;
    description: string;
    images: string[];
    hours?: OpeningHours;
    pricing?: string;
    address?: string;
    transport?: TransportMode[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PlaceFilters {
    categories: PlaceCategory[];
    searchQuery: string;
}

export interface PlacesState {
    items: Place[];
    filteredItems: Place[];
    loading: boolean;
    error: string | null;
    filters: PlaceFilters;
    selectedPlace: Place | null;
}

const initialState: PlacesState = {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    filters: {
        categories: [],
        searchQuery: '',
    },
    selectedPlace: null,
};

export const fetchPlaces = createAsyncThunk<
    Place[],
    void,
    { rejectValue: string }
>(
    'places/fetchPlaces',
    async (_, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            console.log('Fetching places...');
            return [];
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : 'Failed to fetch places'
            );
        }
    }
);

const applyFilters = (places: Place[], filters: PlaceFilters): Place[] => {
    let filtered = places;

    if (filters.categories.length > 0) {
        filtered = filtered.filter((place) =>
            filters.categories.includes(place.category)
        );
    }

    if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter((place) =>
            place.name.toLowerCase().includes(query) ||
            place.description.toLowerCase().includes(query)
        );
    }

    return filtered;
};

const placesSlice = createSlice({
    name: 'places',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.filters.searchQuery = action.payload;
            state.filteredItems = applyFilters(state.items, state.filters);
        },
        setCategories: (state, action: PayloadAction<PlaceCategory[]>) => {
            state.filters.categories = action.payload;
            state.filteredItems = applyFilters(state.items, state.filters);
        },
        clearFilters: (state) => {
            state.filters = {
                categories: [],
                searchQuery: '',
            };
            state.filteredItems = state.items;
        },
        setSelectedPlace: (state, action: PayloadAction<Place | null>) => {
            state.selectedPlace = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlaces.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.filteredItems = applyFilters(action.payload, state.filters);
            })
            .addCase(fetchPlaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch places';
            });
    },
});

export const { setSearchQuery, setCategories, clearFilters, setSelectedPlace } =
    placesSlice.actions;
export default placesSlice.reducer;
