import { createContext, useContext } from "solid-js";
import { Store } from "./store";

export const StoreContext = createContext<Store>()
export const useStore = () => {
    const store = useContext(StoreContext)
    if (!store) {
        console.error('Failed to load store, wrap component into StoreContext')
    }
    
    return store!
}
