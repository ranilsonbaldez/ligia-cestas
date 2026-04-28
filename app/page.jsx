"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cestas, ADICIONAIS } from "./cestas";

export default function Home() {
  const [modalAberto, setModalAberto] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [cestaSelecionada, setCestaSelecionada] = useState(null);
  const [mesmoDestinatario, setMesmoDestinatario] = useState(false);
  const [cardExpandido, setCardExpandido] = useState(null); // Armazena o ID da cesta aberta
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState([]);

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
    // Se o usuário clicar em "Quero essa" em uma cesta diferente da que ele estava marcando adicionais
    if (cestaSelecionada?.id !== cesta.id) {
      setAdicionaisSelecionados([]); // Reseta para não cobrar adicionais da cesta errada
    }
    setCestaSelecionada(cesta);
    setEtapa(1);
    setModalAberto(true);
  };

  const fecharFormulario = () => {
    setModalAberto(false);
  };

  const copiarPix = () => {
    const chave = "05378768390";
    navigator.clipboard.writeText(chave);
    alert("Chave Pix copiada com sucesso!"); // Feedback simples
  };

  const handleWhatsApp = () => {
    if (!cestaSelecionada) return;

    const textoDestinatario = mesmoDestinatario
      ? "Eu mesmo irei receber"
      : form.destinatario;

    const formatarDataBR = (dataEntrada) => {
      if (!dataEntrada) return "Não informada";
      const [ano, mes, dia] = dataEntrada.split("-");
      return `${dia}/${mes}/${ano.slice(-2)}`;
    };

    const dataFinal = formatarDataBR(form.data);

    // Cálculo do valor dinâmico
    const valorCesta = parseFloat(cestaSelecionada.preco.replace(",", "."));
    const valorAdicionais = adicionaisSelecionados.reduce(
      (acc, item) => acc + item.preco,
      0,
    );
    const precoTotalCalculado = (valorCesta + valorAdicionais)
      .toFixed(2)
      .replace(".", ",");

    // Lista de adicionais para a mensagem (opcional, mas ajuda muito o técnico)
    const txtAdicionais =
      adicionaisSelecionados.length > 0
        ? `%0A*Adicionais:* ${adicionaisSelecionados.map((i) => i.nome).join(", ")}.`
        : "";

    // Montagem da mensagem com o valor antes do pagamento
    const msg =
      `Olá! Me chamo *${form.nome}*, e escolhi esta cesta para um momento especial.%0A%0A` +
      `*Pedido: ${cestaSelecionada.nome}*${txtAdicionais}%0A` +
      `*De:* ${form.nome}%0A` +
      `*Para:* ${textoDestinatario}%0A` +
      `*Data:* ${dataFinal} às ${form.horario}%0A` +
      `*Endereço da entrega:* ${form.endereco}%0A` +
      `*Total:* R$ ${precoTotalCalculado}%0A` + // Valor dinâmico aqui
      `*Pagamento:* ${form.metodoPgto}`;

    window.open(`https://wa.me/5598984881768?text=${msg}`, "_blank");
  };

  // Calcula o dia de amanhã
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const dataMinima = amanha.toISOString().split("T")[0];

  return (
    <main className="min-h-screen flex flex-col bg-soft">
      <header className="w-full bg-[#630d16] h-20 md:h-28 flex items-center justify-center border-b border-[#D4AF37]/20 shadow-xl">
        {/* h-20 fixa a altura no mobile, h-28 no desktop */}

        <div className="max-w-7xl mx-auto px-4 w-full flex justify-center">
          <Link
            href="/"
            className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Image
              src="/logo-ligia.svg"
              alt="Lígia Cestas & Presentes"
              width={500}
              height={150}
              priority
              // h-16 e md:h-20 limitam a altura da imagem para ela não esticar o header
              className="object-contain w-auto h-16 md:h-20"
            />
          </Link>
        </div>
      </header>

      {/* Seção de Chamada para o Sorteio - Minimalista */}
      <section className="py-10 px-6 border-b border-gray-100 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-[#630d16] text-xl md:text-2xl font-bold mb-2">
            Sorteio Especial Dia das Mães
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Garanta seu número da sorte e concorra a uma Cesta Premium.
          </p>

          <Link
            href="/sorteio"
            className="inline-block bg-[#630d16] text-white font-bold px-10 py-3 rounded-full hover:bg-[#80121c] transition-all shadow-md active:scale-95"
          >
            Participar do Sorteio
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pt-2 pb-10">
        <h2 className="text-lg md:text-xl font-serif text-primary text-center uppercase tracking-[0.1em] leading-none my-6">
          Nossos Cardápios
        </h2>

        <div className="block w-full">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "24px",
              width: "100%",
            }}
          >
            {cestas.map((cesta) => (
              <div
                key={cesta.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-accent/15 hover:scale-[1.01] transition-transform duration-300"
                style={{ width: "320px", flex: "0 0 320px" }}
              >
                {/* Cabeçalho do Card - Slim */}
                <div className="bg-primary p-3 text-center border-b-2 border-secondary/30">
                  <h3 className="text-lg font-serif font-bold text-secondary tracking-tighter leading-tight truncate">
                    {cesta.nome}
                  </h3>
                </div>

                <div
                  className="relative w-full border-b border-accent/10 overflow-hidden"
                  style={{ aspectRatio: "1200 / 750" }}
                >
                  <Image
                    src={cesta.imagem}
                    alt={cesta.nome}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* Container de conteúdo - Padding Reduzido */}
                <div className="p-5 flex-grow flex-col flex">
                  {/* PREÇO DINÂMICO: Soma o valor da cesta + adicionais marcados */}
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-primary">
                      R${" "}
                      {(() => {
                        const valorBase = parseFloat(
                          cesta.preco.replace(",", "."),
                        );
                        // Somente soma se os adicionais selecionados forem desta cesta específica
                        const extras =
                          cestaSelecionada?.id === cesta.id
                            ? adicionaisSelecionados.reduce(
                                (acc, i) => acc + i.preco,
                                0,
                              )
                            : 0;
                        return (valorBase + extras)
                          .toFixed(2)
                          .replace(".", ",");
                      })()}
                    </span>
                  </div>

                  {/* LISTA DE ITENS DA CESTA */}
                  <ul className="space-y-1.5 mb-4 flex-grow border-t pt-3">
                    {cesta.itens.map((item, i) => (
                      <li
                        key={i}
                        className="text-gray-600 text-xs flex items-center gap-2"
                      >
                        <span className="text-accent text-[9px]">❤</span> {item}
                      </li>
                    ))}
                  </ul>

                  {/* BOTÃO EXPANSÍVEL DE ADICIONAIS */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() =>
                        setCardExpandido(
                          cardExpandido === cesta.id ? null : cesta.id,
                        )
                      }
                      className="text-[10px] font-bold text-primary uppercase flex items-center gap-1 hover:underline"
                    >
                      {cardExpandido === cesta.id
                        ? "− Fechar Adicionais"
                        : "+ Adicionais (Opcional)"}
                    </button>

                    {cardExpandido === cesta.id && (
                      <div className="mt-3 space-y-2 bg-gray-50 p-3 rounded-xl border border-dashed border-accent/30 animate-in fade-in slide-in-from-top-1">
                        {ADICIONAIS.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="w-3.5 h-3.5 accent-primary"
                                checked={
                                  !!adicionaisSelecionados.find(
                                    (i) => i.id === item.id,
                                  )
                                }
                                onChange={(e) => {
                                  // Garante que ao marcar um adicional, a "cestaSelecionada" seja esta
                                  setCestaSelecionada(cesta);
                                  if (e.target.checked) {
                                    setAdicionaisSelecionados([
                                      ...adicionaisSelecionados,
                                      item,
                                    ]);
                                  } else {
                                    setAdicionaisSelecionados(
                                      adicionaisSelecionados.filter(
                                        (i) => i.id !== item.id,
                                      ),
                                    );
                                  }
                                }}
                              />
                              <span className="text-[11px] text-gray-600">
                                {item.nome}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-primary/60">
                              + R$ {item.preco.toFixed(2).replace(".", ",")}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => abrirFormulario(cesta)}
                    className="w-full bg-secondary text-primary font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs shadow-md hover:brightness-95 transition-all"
                  >
                    Quero Essa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                    <div className="space-y-6">
                      {/* Campo: Quem está pedindo */}
                      <div className="relative group">
                        <input
                          type="text"
                          required
                          className="peer w-full border-b-2 border-accent/20 bg-transparent p-4 pl-0 text-base text-gray-800 placeholder-transparent focus:border-primary focus:outline-none transition-colors"
                          placeholder="Seu Nome"
                          id="nomePede"
                          value={form.nome}
                          onChange={(e) => {
                            const novoNome = e.target.value;
                            setForm({
                              ...form,
                              nome: novoNome,
                              // Se o checkbox estiver marcado, atualiza o destinatário junto
                              destinatario: mesmoDestinatario
                                ? novoNome
                                : form.destinatario,
                            });
                          }}
                        />
                        <label
                          htmlFor="nomePede"
                          className="absolute left-0 -top-3 text-sm text-primary group-focus-within:text-xs group-focus-within:-top-5 group-focus-within:text-gray-500 transition-all cursor-text peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400"
                        >
                          Quem está pedindo?{" "}
                          <span className="text-primary/70">*</span>
                        </label>

                        {/* Checkbox de Auto-entrega */}
                        <div className="flex items-center gap-2 mt-2 ml-1">
                          <input
                            type="checkbox"
                            id="mesmoDestinatario"
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                            checked={mesmoDestinatario}
                            onChange={(e) => {
                              const marcado = e.target.checked;
                              setMesmoDestinatario(marcado);
                              if (marcado) {
                                setForm({ ...form, destinatario: form.nome });
                              }
                            }}
                          />
                          <label
                            htmlFor="mesmoDestinatario"
                            className="text-xs text-gray-500 cursor-pointer select-none"
                          >
                            Eu mesmo irei receber
                          </label>
                        </div>
                      </div>

                      {/* Campo: Quem vai receber */}
                      <div
                        className={`relative group transition-opacity ${mesmoDestinatario ? "opacity-50" : "opacity-100"}`}
                      >
                        <input
                          type="text"
                          required={!mesmoDestinatario}
                          disabled={mesmoDestinatario}
                          className="peer w-full border-b-2 border-accent/20 bg-transparent p-4 pl-0 text-base text-gray-800 placeholder-transparent focus:border-primary focus:outline-none transition-colors disabled:cursor-not-allowed"
                          placeholder="Nome de quem recebe"
                          id="nomeRecebe"
                          value={
                            mesmoDestinatario ? form.nome : form.destinatario
                          }
                          onChange={(e) =>
                            setForm({ ...form, destinatario: e.target.value })
                          }
                        />
                        <label
                          htmlFor="nomeRecebe"
                          className="absolute left-0 -top-3 text-sm text-primary group-focus-within:text-xs group-focus-within:-top-5 group-focus-within:text-gray-500 transition-all cursor-text peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400"
                        >
                          {mesmoDestinatario
                            ? "Destinatário igual ao remetente"
                            : "Quem vai receber?"}{" "}
                          <span className="text-primary/70">*</span>
                        </label>
                      </div>
                    </div>

                    {/* Container dos campos de Data e Hora */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quando devemos entregar?{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Campo de Data */}
                        <div className="relative">
                          <input
                            type="date"
                            className="w-full h-12 px-4 rounded-xl border border-accent/20 bg-white text-sm focus:outline-none focus:border-primary text-gray-600"
                            required
                            min={dataMinima}
                            value={form.data || ""}
                            onChange={(e) =>
                              setForm({ ...form, data: e.target.value })
                            }
                          />
                        </div>

                        {/* Campo de Hora - Formato Nativo */}
                        <div className="relative">
                          <input
                            type="time"
                            className="w-full h-12 px-4 rounded-xl border border-accent/20 bg-white text-sm focus:outline-none focus:border-primary text-gray-600"
                            required
                            value={form.horario || ""}
                            onChange={(e) =>
                              setForm({ ...form, horario: e.target.value })
                            }
                          />
                          <style jsx>{`
                            input[type="time"]:inline-block:before {
                              content: "Hora";
                              margin-right: 0.5em;
                              color: #9ca3af;
                            }
                          `}</style>
                        </div>
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
                          Chave Pix (CPF)
                        </p>
                        <p className="text-xl font-mono font-bold text-primary tracking-tight">
                          05378768390
                        </p>
                        <button
                          type="button"
                          onClick={copiarPix} // A mágica acontece aqui
                          className="text-xs text-blue-600 font-bold underline active:text-blue-800"
                        >
                          Copiar Chave
                        </button>
                      </div>
                    )}
                    {form.metodoPgto === "Cartão" && (
                      <div className="bg-rose-50 p-5 rounded-2xl text-sm text-rose-950 border border-rose-200">
                        ⚠ Taxas da maquininha: 2% Débito | 5% Crédito.
                        {/* <p className="mt-2 font-bold underline cursor-pointer">
                          Acessar Link de Pagamento
                        </p> */}
                      </div>
                    )}

                    <p className="text-xs text-red-600 uppercase text-center w-full">
                      * Taxa de entrega a consultar.
                    </p>

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
    </main>
  );
}
