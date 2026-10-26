import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface SelectedCompany {
  companyId: number;
  companyName: string;
  logoUrl: string;
}

const KEY = "selected-company";

interface Ctx {
  selected: SelectedCompany | null;
  ready: boolean;
  selectCompany: (c: SelectedCompany) => void;
}

const CompanyContext = createContext<Ctx | null>(null);

export function readStoredCompany(): SelectedCompany | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SelectedCompany;
    return Number.isInteger(parsed.companyId) &&
      parsed.companyId > 0 &&
      typeof parsed.companyName === "string" &&
      typeof parsed.logoUrl === "string"
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedCompany | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSelected(readStoredCompany());
    setReady(true);
  }, []);

  const selectCompany = useCallback((c: SelectedCompany) => {
    localStorage.setItem(KEY, JSON.stringify(c));
    setSelected(c);
  }, []);

  return (
    <CompanyContext.Provider value={{ selected, ready, selectCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used inside CompanyProvider");
  return ctx;
}
