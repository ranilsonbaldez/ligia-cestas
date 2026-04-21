"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RifaPage() {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [occupiedNumbers, setOccupiedNumbers] = useState([]); // Aqui virão os dados do Supabase

  const totalNumbers = 150;
  const pricePerNumber = 5;

  const toggleNumber = (num) => {
    // Se o número já estiver ocupado (mesmo que o botão ainda não tenha mudado de cor), ignore o clique
    if (occupiedNumbers.includes(num)) return;

    setSelectedNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num],
    );
  };

  const totalPrice = selectedNumbers.length * pricePerNumber;

  useEffect(() => {
    const fetchOccupiedNumbers = async () => {
      const { data, error } = await supabase.from("rifas").select("numero");

      if (!error && data) {
        // Extrai apenas os números do array de objetos
        const numbers = data.map((item) => item.numero);
        setOccupiedNumbers(numbers);
      }
    };

    fetchOccupiedNumbers();
  }, []); // Executa uma vez ao carregar a página

  const handleFinalize = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const comprador = {
      nome: formData.get("nome"),
      presenteado: formData.get("presenteado"),
      telefone: formData.get("telefone"),
      endereco: formData.get("endereco"),
    };

    try {
      const updates = selectedNumbers.map((num) => ({
        numero: num,
        status: "reservado",
        nome_comprador: comprador.nome,
        nome_presenteado: comprador.presenteado,
        telefone: comprador.telefone,
        endereco: comprador.endereco,
      }));

      const { error } = await supabase.from("rifas").insert(updates);
      if (error) throw error;

      const listaNumeros = selectedNumbers.sort((a, b) => a - b).join(", ");
      const mensagem = `Olá, sou ${comprador.nome}, estou participando do sorteio da cesta de café do dia das mães e adquiri o(s) número(s): ${listaNumeros}.`;
      const whatsappUrl = `https://wa.me/5598992274652?text=${encodeURIComponent(mensagem)}`;

      window.location.href = whatsappUrl;
    } catch (error) {
      alert("Erro ao reservar números. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      {/* Cabeçalho (Mesmo padrão que ajustamos) */}
      <header className="w-full bg-[#630d16] h-20 flex items-center justify-center shadow-xl">
        <Link href="/">
          <Image
            src="/logo-ligia.svg"
            alt="Logo"
            width={200}
            height={60}
            className="h-12 w-auto"
          />
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-serif text-[#630d16] text-center uppercase tracking-widest mb-2">
          Rifa Especial Dia das Mães
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Escolha seus números e concorra a uma Cesta Premium!
        </p>

        <div className="flex justify-center gap-4 mb-6 text-xs uppercase font-bold">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
            <span>Livre</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span className="text-gray-400">Vendido</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#D4AF37] rounded"></div>
            <span className="text-[#D4AF37]">Selecionado</span>
          </div>
        </div>

        {/* Grid de Números */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-10">
          {Array.from({ length: totalNumbers }, (_, i) => i + 1).map((num) => {
            const isSelected = selectedNumbers.includes(num);
            const isOccupied = occupiedNumbers.includes(num);

            return (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                disabled={isOccupied}
                className={`
    h-12 w-full rounded-lg text-sm font-bold transition-all flex items-center justify-center
    ${
      isOccupied
        ? "bg-gray-200 text-gray-400 border-transparent shadow-inner opacity-60"
        : isSelected
          ? "bg-[#D4AF37] text-white scale-105 shadow-md z-10"
          : "bg-white border border-gray-200 text-[#630d16] active:bg-orange-50"
    }
  `}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Barra Fixa de Resumo (Aparece ao selecionar números) */}
        {selectedNumbers.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-40">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Selecionados:{" "}
                  {selectedNumbers.sort((a, b) => a - b).join(", ")}
                </p>
                <p className="text-xl font-bold text-[#630d16]">
                  Total: R$ {totalPrice.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => {
                  // Verifica se algum número selecionado acabou de ser ocupado
                  const hasConflict = selectedNumbers.some((num) =>
                    occupiedNumbers.includes(num),
                  );

                  if (hasConflict) {
                    alert(
                      "Ops! Um dos números selecionados acabou de ser reservado. Por favor, escolha outro.",
                    );
                    // Opcional: limpa os números que deram conflito
                    return;
                  }
                  setIsModalOpen(true);
                }}
                className="bg-[#630d16] text-white px-8 py-3 rounded-full font-bold hover:bg-[#80121c] transition-colors"
              >
                Participar Agora
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-[#630d16] p-6 text-white text-center">
              <h3 className="text-xl font-serif uppercase tracking-wider">
                Quase lá!
              </h3>
              <p className="text-sm opacity-80">
                Preencha os dados para reserva dos números
              </p>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleFinalize}>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Seu Nome Completo
                </label>
                <input
                  name="nome" // <--- Adicionado
                  required
                  type="text"
                  className="w-full border-b-2 border-gray-200 focus:border-[#D4AF37] outline-none py-2 transition-colors"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Quem você quer presentear?
                </label>
                <input
                  name="presenteado" // <--- Adicionado
                  required
                  type="text"
                  className="w-full border-b-2 border-gray-200 focus:border-[#D4AF37] outline-none py-2 transition-colors"
                  placeholder="Ex: Minha Mãe (Maria)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    name="telefone" // <--- Adicionado
                    required
                    type="tel"
                    className="w-full border-b-2 border-gray-200 focus:border-[#D4AF37] outline-none py-2 transition-colors"
                    placeholder="(98) 9..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Valor Total
                  </label>
                  <div className="py-2 font-bold text-[#630d16]">
                    R$ {totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Endereço para Entrega
                </label>
                <textarea
                  name="endereco" // <--- Adicionado
                  required
                  rows="2"
                  className="w-full border-b-2 border-gray-200 focus:border-[#D4AF37] outline-none py-2 transition-colors resize-none"
                  placeholder="Rua, número, bairro..."
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-[#630d16] text-white py-3 rounded-xl font-bold hover:bg-[#80121c] shadow-lg transition-transform active:scale-95"
                >
                  Finalizar e Pagar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
