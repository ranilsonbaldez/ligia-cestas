"use client"; // Obrigatório para usar o useState

import { useState } from "react";
import Image from "next/image";

export default function FotoSorteio({ src, alt }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Miniatura que aparece na página */}
      <div
        className="relative w-20 h-20 sm:w-24 sm:h-24 cursor-pointer overflow-hidden rounded-lg border border-gray-200 shadow-sm"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Modal que abre ao clicar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full max-w-3xl aspect-square">
            <Image src={src} alt={alt} fill className="object-contain" />
            <button className="absolute -top-10 right-0 text-white font-bold text-lg">
              X FECHAR
            </button>
          </div>
        </div>
      )}
    </>
  );
}
