import { act } from "react-dom/test-utils";
import {vi} from 'vitest';
const {create: actualCreate} = await vi.importActual('zustand');

const storeResetFns = new Set();

export const create = (createStore) => {
    const store = actualCreate(createStore);
    const initialState = store.getState();
    storeResetFns.add(() => store.setState(initialState, true));
    return store;
}

beforeEach(() => {
    act(() => storeResetFns.forEach((resentFn) => resentFn()));
});