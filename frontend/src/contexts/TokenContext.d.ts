import { ReactNode } from "react";
interface TokenContextType {
    balance: number;
    setBalance: (balance: number) => void;
}
export declare function TokenProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useTokenBalance(): TokenContextType;
export {};
