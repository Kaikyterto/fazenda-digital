import React from "react";
import logoImg from "./logo.png";

export function Logo({ size = "md" }) {
  const containerSizes = {
    sm: "gap-2.5",
    md: "gap-3",
    lg: "gap-4",
  };

  // Alterado para permitir uma largura maior (w-24, w-32, etc.) mantendo a altura proporcional
  const iconSizes = {
    sm: "w-20 h-8",
    md: "w-28 h-10",
    lg: "w-36 h-12",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  const subtextSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
  };

  return (
    <div className={`flex items-center ${containerSizes[size]} cursor-pointer group select-none`}>
      {/* Container da Imagem com proporção mais larga */}
      <div
        className={`flex items-center justify-center ${iconSizes[size]} transition-transform duration-150 group-hover:scale-105`}
      >
        <img 
          src={logoImg} 
          alt="Logo Fazenda Digital" 
          className="w-full h-full object-contain drop-shadow-sm" 
        />
      </div>

      {/* Identidade de Texto */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-zinc-900 ${textSizes[size]}`}>
            FAZENDA
            <span className="text-emerald-600 bg-emerald-100/60 px-1 rounded border border-emerald-500/20 ml-0.5">
              .DIGITAL
            </span>
          </span>
        </div>
     
      </div>
    </div>
  );
}