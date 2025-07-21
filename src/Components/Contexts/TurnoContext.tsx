// Source/Context/TurnoContext.tsx
import { createContext, useContext, useState } from "react";

type TurnoData = {
  service?: { title: string; price: number; duration: number, _id:string };
  selectedDate?: string;
  selectedTime?: string;
  selectedProfessional?: {
    id: string;
    name: string;
    date?: string;
    rating?: number;
    isAuto: boolean;
  };
  contactData?: { name: string; phone: string }; // más adelante
};

const TurnoContext = createContext<{
  turno: TurnoData;
  setTurno: React.Dispatch<React.SetStateAction<TurnoData>>;
}>({
  turno: {},
  setTurno: () => {},
});

export const TurnoProvider = ({ children }: { children: React.ReactNode }) => {
  const [turno, setTurno] = useState<TurnoData>({});
  return (
    <TurnoContext.Provider value={{ turno, setTurno }}>
      {children}
    </TurnoContext.Provider>
  );
};

export const useTurno = () => useContext(TurnoContext);
