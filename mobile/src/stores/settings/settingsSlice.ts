import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {Settings} from '../../types/settings';

const initialState: Settings = {
    openedAlbum: null,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialState,
    reducers: {
        settingsUrlChanged: (state, action: PayloadAction<string>) => {
            state.serverUrl = action.payload;
        },
        settingsOpenedAlbumChanged: (state, action: PayloadAction<string>) => {
            state.openedAlbum = action.payload;
        },
    },
});

export const {settingsUrlChanged, settingsOpenedAlbumChanged} =
    settingsSlice.actions;
export default settingsSlice.reducer;

export const selectSettings = createSelector(
    [(state: {settings: Settings}) => state.settings],
    settings => settings,
);

export const selectOpenedAlbum = createSelector(
    [(state: {settings: Settings}) => state.settings],
    settings => settings.openedAlbum,
);
