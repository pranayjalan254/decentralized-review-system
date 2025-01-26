import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const TokenContext = createContext(undefined);
export function TokenProvider({ children }) {
    const [balance, setBalance] = useState(500);
    return (_jsx(TokenContext.Provider, { value: { balance, setBalance }, children: children }));
}
export function useTokenBalance() {
    const context = useContext(TokenContext);
    if (context === undefined) {
        throw new Error("useTokenBalance must be used within a TokenProvider");
    }
    return context;
}
