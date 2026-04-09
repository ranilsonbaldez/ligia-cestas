"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cestas } from "./cestas";

export default function Home() {
  const [modalAberto, setModalAberto] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [cestaSelecionada, setCestaSelecionada] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    destinatario: "",
    data: "",
    horario: "",
    endereco: "",
    metodoPgto: "",
  });

  // SOLUÇÃO PARA O ERRO DE LINT: Gerenciar o scroll via useEffect
  useEffect(() => {
    if (modalAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Limpa o estilo caso o componente seja desmontado
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalAberto]);

  const abrirFormulario = (cesta) => {
    setCestaSelecionada(cesta);
    setEtapa(1);
    setModalAberto(true);
  };

  const fecharFormulario = () => {
    setModalAberto(false);
  };

  const handleWhatsApp = () => {
    if (!cestaSelecionada) return;

    const msg = `*Pedido: ${cestaSelecionada.nome}*%0A*De:* ${form.nome}%0A*Para:* ${form.destinatario}%0A*Data:* ${form.data} às ${form.horario}%0A*Endereço:* ${form.endereco}%0A*Pagamento:* ${form.metodoPgto}`;
    window.open(`https://wa.me/5598992274652?text=${msg}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-soft pb-10">
      <header className="w-full bg-primary py-6 px-4 border-b-2 border-secondary shadow-xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-secondary tracking-widest">
            Lígia Cestas & Presentes
          </h1>

          <p className="mt-2 text-accent italic text-base md:text-xl font-light tracking-wide">
            Momentos Inesquecíveis pra você
          </p>

          {/* O divisor ficou mais delicado para acompanhar o estilo slim */}
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="h-[1px] w-12 bg-secondary/30"></div>
            <span className="text-secondary text-[10px]">✦</span>
            <div className="h-[1px] w-12 bg-secondary/30"></div>
          </div>
        </div>
      </header>

      {/* --- Grid de Cestas Atualizado (Slim) --- */}
      <section className="max-w-7xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-serif text-primary text-center mb-8 uppercase tracking-[0.2em] leading-none">
          Nossos Cardápios
        </h2>

        {/* Ajuste no Grid: Adicionado p-2 e items-start */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2 items-start">
          {cestas.map((cesta) => (
            <div
              key={cesta.id}
              /* CORREÇÃO 1: 'max-w-xs' e 'mx-auto' para o card flutuar e centralizar no celular */
              className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-accent/15 max-w-xs mx-auto hover:scale-[1.01] transition-transform duration-300 w-full"
            >
              {/* Cabeçalho do Card - Slim */}
              <div className="bg-primary p-3 text-center border-b-2 border-secondary/30">
                <h3 className="text-lg font-serif font-bold text-secondary uppercase tracking-tighter leading-tight truncate">
                  {cesta.nome}
                </h3>
              </div>

              {/* CORREÇÃO 2: 'h-48' em vez de 'h-64' para reduzir a imagem */}
              <div className="relative h-48 w-full border-b border-accent/10">
                <Image
                  src={cesta.imagem}
                  alt={cesta.nome}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Container de conteúdo - Padding Reduzido */}
              <div className="p-5 flex-grow flex flex-col">
                {/* CORREÇÃO 3: Preço e Título mais compactos */}
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-primary">
                    R$ {cesta.preco}
                  </span>
                </div>

                {/* CORREÇÃO 4: Lista Slim - Fonte 'xs', espaçamento 'space-y-1.5' */}
                <ul className="space-y-1.5 mb-6 flex-grow border-t border-accent/5 pt-3">
                  {cesta.itens.map((item, i) => (
                    <li
                      key={i}
                      className="text-gray-600 text-xs flex items-center gap-2 leading-tight"
                    >
                      <span className="text-accent text-[9px]">❤</span> {item}
                    </li>
                  ))}
                </ul>

                {/* Botão Slim - 'py-3' e fonte 'xs' */}
                <button
                  type="button"
                  onClick={() => abrirFormulario(cesta)}
                  className="w-full bg-secondary text-primary font-bold py-3.5 rounded-xl active:scale-95 transition-all shadow-lg uppercase tracking-widest text-xs cursor-pointer touch-manipulation"
                >
                  Quero Essa
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ------------------------------------- */}

      {modalAberto && (
        /* 1. Overlay centralizado com p-4 para folga lateral em mobile */
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 touch-manipulation">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto border border-accent/10">
            {/* Cabeçalho do Modal: Destaque suave para a Cesta */}
            {/* Cabeçalho do Modal - Versão Slim */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-3 border-b border-accent/10 flex justify-between items-center z-20">
              <div className="flex flex-col">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold leading-none mb-1">
                  Pedido Selecionado
                </p>
                <h3 className="font-serif font-bold text-base text-primary leading-tight truncate max-w-[200px] md:max-w-xs">
                  {cestaSelecionada?.nome}
                </h3>
              </div>

              <button
                onClick={fecharFormulario}
                className="bg-gray-50 hover:bg-rose-50 p-2 rounded-full text-gray-400 hover:text-rose-500 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Container Principal com Padding suave */}
            <div className="p-6 md:p-10">
              <div className="max-w-md mx-auto">
                {etapa === 1 ? (
                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setEtapa(2);
                    }}
                  >
                    {/* Bloco 1: Identificação (Quem Pede e Recebe) */}
                    <div className="space-y-4">
                      <div className="relative group">
                        <input
                          type="text"
                          required
                          className="peer w-full border-b-2 border-accent/20 bg-transparent p-4 pl-0 text-base text-gray-800 placeholder-transparent focus:border-primary focus:outline-none transition-colors"
                          placeholder="Seu Nome"
                          id="nomePede"
                          onChange={(e) =>
                            setForm({ ...form, nome: e.target.value })
                          }
                        />
                        <label
                          htmlFor="nomePede"
                          className="absolute left-0 -top-3 text-sm text-primary group-focus-within:text-xs group-focus-within:-top-5 group-focus-within:text-gray-500 transition-all cursor-text peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400"
                        >
                          Quem está pedindo?{" "}
                          <span className="text-primary/70">*</span>
                        </label>
                      </div>

                      <div className="relative group">
                        <input
                          type="text"
                          required
                          className="peer w-full border-b-2 border-accent/20 bg-transparent p-4 pl-0 text-base text-gray-800 placeholder-transparent focus:border-primary focus:outline-none transition-colors"
                          placeholder="Nome de quem recebe"
                          id="nomeRecebe"
                          onChange={(e) =>
                            setForm({ ...form, destinatario: e.target.value })
                          }
                        />
                        <label
                          htmlFor="nomeRecebe"
                          className="absolute left-0 -top-3 text-sm text-primary group-focus-within:text-xs group-focus-within:-top-5 group-focus-within:text-gray-500 transition-all cursor-text peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400"
                        >
                          Quem vai receber?{" "}
                          <span className="text-primary/70">*</span>
                        </label>
                      </div>
                    </div>

                    {/* Bloco 2: Logística (Data e Hora) */}
                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                        Quando devemos entregar?
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="date"
                          required
                          className="border-2 border-accent/10 p-4 rounded-xl text-base text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                          onChange={(e) =>
                            setForm({ ...form, data: e.target.value })
                          }
                        />
                        <input
                          type="time"
                          required
                          className="border-2 border-accent/10 p-4 rounded-xl text-base text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                          onChange={(e) =>
                            setForm({ ...form, horario: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Bloco 3: Local (Endereço) */}
                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                        Onde entregar?
                      </p>
                      <textarea
                        placeholder="Endereço completo (rua, número, bairro, ponto de referência)"
                        required
                        className="w-full border-2 border-accent/10 p-4 rounded-xl text-base text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        rows={3}
                        onChange={(e) =>
                          setForm({ ...form, endereco: e.target.value })
                        }
                      />
                    </div>

                    {/* Botão de Avançar: Dourado para Leveza */}
                    <button
                      type="submit"
                      className="w-full bg-secondary text-primary font-bold py-5 rounded-2xl shadow-lg uppercase tracking-widest text-sm active:scale-[0.98] transition-all hover:bg-[#c29d2f]"
                    >
                      Avançar para Pagamento
                    </button>
                  </form>
                ) : (
                  /* Etapa de Pagamento (Adaptada para Leveza) */
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <h4 className="text-2xl font-serif text-center text-primary italic mb-6">
                      Como prefere pagar?
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, metodoPgto: "Pix" })}
                        className={`p-6 border-2 rounded-2xl flex flex-col items-center transition-all ${
                          form.metodoPgto === "Pix"
                            ? "border-primary bg-primary/5 shadow-inner"
                            : "border-accent/10 hover:border-accent/30"
                        }`}
                      >
                        <span className="text-3xl">📱</span>
                        <span className="font-bold text-gray-800 mt-2">
                          Pix
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setForm({ ...form, metodoPgto: "Cartão" })
                        }
                        className={`p-6 border-2 rounded-2xl flex flex-col items-center transition-all ${
                          form.metodoPgto === "Cartão"
                            ? "border-primary bg-primary/5 shadow-inner"
                            : "border-accent/10 hover:border-accent/30"
                        }`}
                      >
                        <span className="text-3xl">💳</span>
                        <span className="font-bold text-gray-800 mt-2">
                          Cartão
                        </span>
                      </button>
                    </div>

                    {/* Detalhes do Pagamento MANTIDOS (conforme sua lógica) */}
                    {form.metodoPgto === "Pix" && (
                      <div className="bg-gray-50 p-5 rounded-2xl text-center border-2 border-dashed border-accent/20 space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase">
                          Chave Pix (Celular)
                        </p>
                        <p className="text-xl font-mono font-bold text-primary tracking-tight">
                          98988887777
                        </p>
                        <button
                          type="button"
                          className="text-xs text-blue-600 font-bold underline"
                        >
                          Copiar Chave
                        </button>
                      </div>
                    )}
                    {form.metodoPgto === "Cartão" && (
                      <div className="bg-rose-50 p-5 rounded-2xl text-sm text-rose-950 border border-rose-200">
                        ⚠ Taxas da maquininha: 2% Débito | 5% Crédito.
                        <p className="mt-2 font-bold underline cursor-pointer">
                          Acessar Link de Pagamento
                        </p>
                      </div>
                    )}

                    {/* Botão Final: Verde Acolhedor */}
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      disabled={!form.metodoPgto}
                      className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-green-700 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-wider"
                    >
                      PEDIR NO WHATSAPP 🎉
                    </button>

                    <button
                      type="button"
                      onClick={() => setEtapa(1)}
                      className="w-full text-gray-400 text-xs uppercase font-bold tracking-widest text-center"
                    >
                      ← Voltar aos dados
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
