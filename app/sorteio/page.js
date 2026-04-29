"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import FotoSorteio from "../components/FotoSorteio";

export default function RifaPage() {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [occupiedNumbers, setOccupiedNumbers] = useState([]); // Aqui virão os dados do Supabase
  const [showCheckout, setShowCheckout] = useState(false);
  const [dadosCompra, setDadosCompra] = useState(null);

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

      // --- ALTERAÇÃO AQUI: EM VEZ DE REDIRECIONAR, PREPARAMOS O CHECKOUT ---

      setDadosCompra({
        nome: comprador.nome,
        numeros: [...selectedNumbers].sort((a, b) => a - b), // Mantém a lista ordenada
        total: totalPrice,
        // Este é o seu código PIX "Copia e Cola" (Chave Celular Ligia Mourão)
        pixCopiaECola:
          "00020101021126330014br.gov.bcb.pix0111053787683905204000053039865802BR5914LIGIA M BALDEZ6008SAO LUIS62070503***63047CD3",
      });

      setIsModalOpen(false); // Fecha o modal de formulário
      setShowCheckout(true); // Abre a tela com o resumo e PIX

      // Opcional: Limpa os números selecionados para evitar duplicidade visual
      // setSelectedNumbers([]);
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
        <h1 className="text-1xl font-serif bold text-[#630d16] text-center uppercase tracking-widest mb-2">
          Sorteio Especial Dia das Mães
        </h1>
        <p className="text-center text-gray-600 text-xs mb-4">
          Escolha seus números e concorra a uma Cesta Premium!
        </p>

        <div className="flex flex-col items-center justify-center mb-4">
          <p className="text-xs font-bold text-[#630d16] uppercase tracking-widest mb-3">
            Confira o Prêmio:
          </p>
          <FotoSorteio
            src="/cesta-sorteio.png" // Certifique-se que a foto está em public/images/
            alt="Cesta Premium Dia das Mães"
          />
          <p className="text-[10px] text-gray-400 mt-2 italic">
            (Clique na imagem para ampliar)
          </p>
        </div>

        <p className="text-center text-gray-700 font-medium text-xs my-4 mb-4">
          Sorteio dia{" "}
          <span className="font-bold text-[#630d16]">08/05/2026</span> às{" "}
          <span className="font-bold text-[#630d16]">19h</span> pelo nosso
          <a
            href="https://www.instagram.com/ligiacestasepresentes"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-[#E1306C] hover:text-[#bc2a8d] font-bold underline decoration-2 underline-offset-4 transition-colors"
          >
            Instagram
          </a>
          .
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
                    name="telefone"
                    required
                    type="tel"
                    inputMode="numeric"
                    maxLength="15" // Limita o tamanho visual (98)99999-9999
                    className="w-full border-b-2 border-gray-200 focus:border-[#D4AF37] outline-none py-2 transition-colors"
                    placeholder="(98) 99999-9999"
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número

                      // Aplica a máscara (XX)XXXXX-XXXX
                      if (value.length <= 11) {
                        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
                        value = value.replace(/(\d{5})(\d)/, "$1-$2");
                      }

                      e.target.value = value;
                    }}
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

              {/* <div>
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
              </div> */}

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
      <footer className="w-full bg-primary py-6 px-4 border-t border-secondary/20 shadow-inner mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[10px] md:text-xs text-secondary/80 font-medium tracking-widest uppercase text-center md:text-left">
            São Luís - MA, 2026
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="https://www.instagram.com/ligiacestasepresentes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-secondary hover:text-accent transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-tighter">
                Instagram
              </span>
            </a>

            <a
              href="https://wa.me/5598984881768"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-secondary hover:text-accent transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-13.5 8.38 8.38 0 0 1 3.8.9L21 3z"></path>
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-tighter">
                WhatsApp
              </span>
            </a>
          </div>
        </div>
      </footer>
      {/* TELA DE CHECKOUT / PIX */}
      {showCheckout && dadosCompra && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col animate-in fade-in duration-300">
          <header className="w-full bg-[#630d16] h-20 flex items-center justify-center shadow-md">
            <Image
              src="/logo-ligia.svg"
              alt="Logo"
              width={150}
              height={45}
              className="h-10 w-auto"
            />
          </header>

          <main className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
              Reserva Confirmada!
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Siga os passos abaixo para concluir seu pagamento.
            </p>

            {/* Resumo Card */}
            <div className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-xs uppercase font-bold">
                  Cliente
                </span>
                <span className="text-gray-800 text-xs font-bold">
                  {dadosCompra.nome}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-xs uppercase font-bold">
                  Números
                </span>
                <span className="text-[#630d16] text-xs font-bold">
                  {dadosCompra.numeros.join(", ")}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-800 font-bold">Total a pagar</span>
                <span className="text-green-700 font-bold text-lg font-mono">
                  R$ {dadosCompra.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Pix Copy/Paste */}
            <div className="w-full text-center space-y-3 mb-8">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                Pix Copia e Cola
              </p>
              <div className="bg-gray-100 p-4 rounded-xl border-2 border-dashed border-gray-300 relative">
                <p className="text-[10px] font-mono break-all text-gray-500 mb-4 px-2">
                  {dadosCompra.pixCopiaECola}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(dadosCompra.pixCopiaECola);
                    alert("Código PIX Copiado!");
                  }}
                  className="bg-[#630d16] text-white text-[10px] px-6 py-2 rounded-full font-bold uppercase tracking-tighter hover:bg-[#80121c] active:scale-95 transition-all"
                >
                  Copiar Código
                </button>
              </div>
            </div>

            {/* Botão WhatsApp */}
            <button
              onClick={() => {
                const valorFormatado = totalPrice.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
                const msg = `Olá! Sou ${dadosCompra.nome}. Fiz a reserva do(s) número(s) [${dadosCompra.numeros.join(", ")}]. Segue o comprovante de ${valorFormatado}.`;
                window.open(
                  `https://wa.me/5598984881768?text=${encodeURIComponent(msg)}`,
                  "_blank",
                );
              }}
              className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-[#20ba5a] transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.887-11.888 3.176 0 6.161 1.237 8.406 3.484 2.246 2.248 3.482 5.231 3.482 8.405 0 6.556-5.332 11.888-11.888 11.888-2.011 0-3.987-.51-5.742-1.474l-6.244 1.638zm6.26-4.135c1.611.956 3.197 1.441 4.95 1.441 5.482 0 9.942-4.46 9.942-9.94 0-2.652-1.033-5.147-2.908-7.023-1.875-1.876-4.37-2.909-7.024-2.909-5.482 0-9.94 4.459-9.94 9.941 0 1.942.536 3.754 1.55 5.352l-1.026 3.748 3.856-1.01z" />
              </svg>
              <span>NOTIFICAR VIA WHATSAPP</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 text-gray-400 text-[10px] font-bold uppercase hover:text-gray-600"
            >
              Voltar ao Início
            </button>
          </main>
        </div>
      )}
    </div>
  );
}
