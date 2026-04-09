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
    window.open(`https://wa.me/5598900000000?text=${msg}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-soft pb-10">
      <header className="w-full bg-primary py-12 px-4 border-b-4 border-secondary shadow-2xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary tracking-widest uppercase">
            Lígia Cestas
          </h1>
          <p className="mt-3 text-accent italic text-lg md:text-2xl font-light tracking-wide">
            Momentos Inesquecíveis pra você
          </p>
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="h-[1px] w-16 bg-secondary/40"></div>
            <span className="text-secondary">✦</span>
            <div className="h-[1px] w-16 bg-secondary/40"></div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-serif text-primary text-center mb-12 uppercase tracking-[0.2em]">
          Nossos Cardápios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cestas.map((cesta) => (
            <div
              key={cesta.id}
              className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-accent/20 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="bg-primary p-4 text-center">
                <h3 className="text-xl font-serif font-bold text-secondary uppercase tracking-tight">
                  {cesta.nome}
                </h3>
              </div>
              <div className="relative h-64 w-full">
                <Image
                  src={cesta.imagem}
                  alt={cesta.nome}
                  fill
                  className="object-cover"
                  unoptimized // Como são links externos do Unsplash, usamos isso para não precisar configurar domínios agora
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="text-center mb-6">
                  <span className="text-sm text-gray-500 block uppercase italic">
                    Investimento
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    R$ {cesta.preco}
                  </span>
                </div>
                <ul className="space-y-2 mb-8 flex-grow">
                  {cesta.itens.map((item, i) => (
                    <li
                      key={i}
                      className="text-gray-700 text-sm flex items-center gap-2"
                    >
                      <span className="text-accent text-xs">❤</span> {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => abrirFormulario(cesta)}
                  className="w-full bg-secondary text-primary font-bold py-4 rounded-lg active:scale-95 transition-all shadow-lg uppercase tracking-widest text-sm cursor-pointer touch-manipulation"
                >
                  Quero Essa
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {modalAberto && (
        /* 1. O fundo escuro agora tem 'p-4' e 'items-center' para centralizar e dar folga nas laterais */
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 touch-manipulation">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Cabeçalho do Modal */}
            <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center z-10">
              <h3 className="font-serif font-bold text-primary italic">
                Pedido: {cestaSelecionada?.nome}
              </h3>
              <button
                onClick={fecharFormulario}
                className="text-gray-400 text-2xl px-2 hover:text-primary transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-8">
              <div className="max-w-md mx-auto">
                {etapa === 1 ? (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setEtapa(2);
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Seu Nome"
                      required
                      className="w-full border border-gray-200 p-3 px-4 rounded-lg outline-none focus:ring-2 focus:ring-primary shadow-sm"
                      onChange={(e) =>
                        setForm({ ...form, nome: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Quem vai receber?"
                      required
                      className="w-full border border-gray-200 p-3 px-4 rounded-lg outline-none focus:ring-2 focus:ring-primary shadow-sm"
                      onChange={(e) =>
                        setForm({ ...form, destinatario: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        required
                        className="border border-gray-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) =>
                          setForm({ ...form, data: e.target.value })
                        }
                      />
                      <input
                        type="time"
                        required
                        className="border border-gray-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) =>
                          setForm({ ...form, horario: e.target.value })
                        }
                      />
                    </div>
                    <textarea
                      placeholder="Endereço Completo"
                      required
                      className="w-full border border-gray-200 p-3 px-4 rounded-lg outline-none focus:ring-2 focus:ring-primary shadow-sm"
                      rows={3}
                      onChange={(e) =>
                        setForm({ ...form, endereco: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="w-full bg-primary text-white font-bold py-4 rounded-lg shadow-lg uppercase tracking-widest active:scale-95 transition-transform"
                    >
                      Avançar para Pagamento
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    {/* O conteúdo do pagamento aqui (Pix/Cartão) */}
                    <h4 className="font-bold text-primary uppercase text-sm text-center">
                      Escolha a forma de pagamento:
                    </h4>

                    {/* ... mantenha seus botões de Pix e Cartão aqui ... */}

                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="w-full bg-green-600 text-white font-bold py-4 rounded-lg shadow-xl hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      PEDIR NO WHATSAPP ➔
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
