'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'fr' | 'ar';

interface AdminLangContextType {
  lang: Lang;
  toggleLang: () => void;
}

const AdminLangContext = createContext<AdminLangContextType | undefined>(undefined);

export function AdminLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('adminLang') as Lang;
    if (saved === 'ar' || saved === 'fr') {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('adminLang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'fr' ? 'ar' : 'fr'));
  };

  return (
    <AdminLangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </AdminLangContext.Provider>
  );
}

export function useAdminLang() {
  const context = useContext(AdminLangContext);
  if (context === undefined) {
    throw new Error('useAdminLang must be used within an AdminLangProvider');
  }
  return context;
}
