"use client";
import { useState } from "react";

const cestas = [
  {
    id: 1,
    nome: "Cesta Amanhecer Premium",
    preco: "185,00",
    imagem:
      "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=500",
    itens: [
      "Suco de Laranja Natural",
      "Caneca de Porcelana",
      "Croissants Amanteigados",
      "Geleia Artesanal",
      "Frutas da Estação",
      "Cartão Personalizado",
    ],
  },
  {
    id: 2,
    nome: "Cesta Paixão & Vinho",
    preco: "250,00",
    imagem:
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=500",
    itens: [
      "Vinho Tinto Reservado",
      "Tábua de Queijos",
      "Torradas Finas",
      "Bombons Ferrero",
      "Cesta de Vime Decorada",
      "Arranjo de Rosas",
    ],
  },
];

export default function Home() {
  const [modalAberto, setModalAberto] = useState(false);
  const [etapa, setEtapa] = useState(1); // 1: Form, 2: Pagamento
  const [cestaSelecionada, setCestaSelecionada] = useState(null);

  // Estados do Formulário
  const [form, setForm] = useState({
    nome: "",
    destinatario: "",
    data: "",
    horario: "",
    endereco: "",
    metodoPgto: "",
  });

  const abrirFormulario = (cesta) => {
    document.body.style.overflow = "hidden";
    setCestaSelecionada(cesta);
    setEtapa(1);
    setModalAberto(true);
  };

  const fecharFormulario = () => {
    document.body.style.overflow = "auto";
    setModalAberto(false);
  };

  const handleWhatsApp = () => {
    const msg = `*Pedido: ${cestaSelecionada.nome}*%0A*De:* ${form.nome}%0A*Para:* ${form.destinatario}%0A*Data:* ${form.data} às ${form.horario}%0A*Endereço:* ${form.endereco}%0A*Pagamento:* ${form.metodoPgto}`;
    window.open(`https://wa.me/5598900000000?text=${msg}`, "_blank"); // Substitua pelo seu número
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
              <img
                src={cesta.imagem}
                alt={cesta.nome}
                className="h-64 w-full object-cover"
              />
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-end md:items-center justify-center p-0 md:p-4 touch-manipulation">
          <div className="bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
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

            <div className="p-6">
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
                    className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Quem vai receber?"
                    required
                    className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) =>
                      setForm({ ...form, destinatario: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      required
                      className="border p-3 rounded-lg outline-none"
                      onChange={(e) =>
                        setForm({ ...form, data: e.target.value })
                      }
                    />
                    <input
                      type="time"
                      required
                      className="border p-3 rounded-lg outline-none"
                      onChange={(e) =>
                        setForm({ ...form, horario: e.target.value })
                      }
                    />
                  </div>
                  <textarea
                    placeholder="Endereço Completo"
                    required
                    className="w-full border p-3 rounded-lg outline-none"
                    rows={2}
                    onChange={(e) =>
                      setForm({ ...form, endereco: e.target.value })
                    }
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-4 rounded-lg shadow-lg uppercase tracking-widest"
                  >
                    Avançar para Pagamento
                  </button>
                </form>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h4 className="font-bold text-primary uppercase text-sm">
                    Escolha a forma de pagamento:
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setForm({ ...form, metodoPgto: "Pix" })}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center ${form.metodoPgto === "Pix" ? "border-primary bg-primary/5" : "border-gray-100"}`}
                    >
                      <span className="text-2xl">📱</span>
                      <span className="font-bold">Pix</span>
                    </button>
                    <button
                      onClick={() => setForm({ ...form, metodoPgto: "Cartão" })}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center ${form.metodoPgto === "Cartão" ? "border-primary bg-primary/5" : "border-gray-100"}`}
                    >
                      <span className="text-2xl">💳</span>
                      <span className="font-bold">Cartão</span>
                    </button>
                  </div>

                  {form.metodoPgto === "Pix" && (
                    <div className="bg-gray-50 p-4 rounded-lg text-center border-2 border-dashed border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        Chave Pix (Celular):
                      </p>
                      <p className="text-lg font-mono font-bold text-primary">
                        98988887777
                      </p>
                      <button className="text-xs text-blue-600 font-bold mt-2">
                        Copiar Chave
                      </button>
                    </div>
                  )}

                  {form.metodoPgto === "Cartão" && (
                    <div className="bg-rose-50 p-4 rounded-lg text-sm text-rose-900 border border-rose-200">
                      ⚠ Taxas da maquininha: 2% Débito | 5% Crédito.
                      <p className="mt-2 font-bold underline cursor-pointer">
                        Acessar Link de Pagamento
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleWhatsApp}
                    disabled={!form.metodoPgto}
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-lg shadow-xl hover:bg-green-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    PEDIR NO WHATSAPP ➔
                  </button>
                  <button
                    onClick={() => setEtapa(1)}
                    className="w-full text-gray-400 text-xs uppercase font-bold tracking-widest"
                  >
                    ← Voltar aos dados
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
