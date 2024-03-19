import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {Settings} from '../../types/settings';

const initialState: Settings = {
    serverUrl: 'https://71e3-163-5-23-101.ngrok-free.app/'
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialState,
    reducers: {
        settingsUrlChanged: (state, action: PayloadAction<string>) => {
            state.serverUrl = action.payload;
        },
    },
});

export const {settingsUrlChanged} = settingsSlice.actions;
export default settingsSlice.reducer;

export const selectSettings = createSelector(
    [(state: {settings: Settings}) => state.settings],
    settings => settings,
);
