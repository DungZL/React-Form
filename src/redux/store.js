import { legacy_createStore as createStore, combineReducers } from 'redux';
import { sinhVienReducer } from './reducers/sinhVienReducer';

const rootReducer = combineReducers({
  sinhVienReducer
});

export const store = createStore(
  rootReducer,
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (f) => f
);
