import {create} from "zustand"

export const useThemeStore = create((set)=>({
    theme : localStorage.getItem("talk-theme") || "bumblebee",
    setTheme : (theme) => {
        localStorage.setItem("talk-theme", theme);
        set({theme});
    }
}))