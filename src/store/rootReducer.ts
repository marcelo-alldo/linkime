import { combineSlices } from '@reduxjs/toolkit';
import apiService from './apiService';
import { navigationSlice } from '@/components/theme-layouts/components/navigation/store/navigationSlice';
import paginationSlice from './slices/paginationSlice';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface LazyLoadedSlices {}

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
export const rootReducer = combineSlices(
  /**
   * Static slices
   */
  navigationSlice,
  { pagination: paginationSlice },

  /**
   * Lazy loaded slices
   */
  {
    [apiService.reducerPath]: apiService.reducer,
  },
).withLazyLoadedSlices<LazyLoadedSlices>();

export default rootReducer;
export type { PaginationState } from './slices/paginationSlice';
