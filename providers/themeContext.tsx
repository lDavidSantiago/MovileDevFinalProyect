import { createContext, useContext, useState } from "react";

type ThemeContextType = {
   darkMode: boolean;
   toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
   darkMode: false,
   toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: {children:React.ReactNode}) => {
   const [darkMode, setDarkMode] = useState(false);

   const toggleTheme = () => {
      setDarkMode(state => !state);
   };
   return (
      //Con esto hago que todo dentro de (children) puedan acceder a darkmode y toggleTheme
      <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
         {children}
      </ThemeContext.Provider>
   );

}
export const useTheme = () => useContext(ThemeContext);

//AsyncStorage