import { ReactNode } from "react";

export const WrapperTitle = ({
  children 
}: { 
  children: ReactNode
}) => {
  return (
    <div className="w-[85%] flex bg-cover bg-no-repeat relative mx-auto">
      {children}
    </div>
  );
}