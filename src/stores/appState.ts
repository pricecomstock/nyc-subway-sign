import { writable } from "svelte/store";
import { AppState } from "../DisplaySpec";

export const currentAppState = writable(new AppState());
