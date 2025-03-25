import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { setupListeners } from '@reduxjs/toolkit/query';
import api from '../Services/Api/api';
import common from './Common';
import loader from './Loader';
import { weatherApi } from '../Services/Api/weather/index';
import { liveflightApi } from '../Services/Api/lifeflight';
import { geoLocationApi } from '../Services/Api/geolocation/index';

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['common'],
};
const reducers = combineReducers({
  common,
  loader,
  [weatherApi.reducerPath]: weatherApi.reducer,
  [liveflightApi.reducerPath]:liveflightApi.reducer,
  [geoLocationApi.reducerPath]:geoLocationApi.reducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(rootPersistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware, weatherApi.middleware,liveflightApi.middleware,geoLocationApi.middleware);
    return middlewares;
  },
});

const persistor = persistStore(store);
setupListeners(store.dispatch);
// types

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
