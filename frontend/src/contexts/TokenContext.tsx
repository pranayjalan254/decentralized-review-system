import { createContext, useContext, useState, ReactNode } from "react";

interface TokenContextType {
  balance: number;
  setBalance: (balance: number) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(500);

  return (
    <TokenContext.Provider value={{ balance, setBalance }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokenBalance() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useTokenBalance must be used within a TokenProvider");
  }
  return context;
}
