import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
   return twMerge(clsx(inputs));
}

// Alias `cn` to `cn` for compatibility with Fushion ui
export const ny = (...inputs) => cn(...inputs);

//Shadcn expects CN 
//Fushion UI expects cn