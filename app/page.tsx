"use client";
import { useState } from "react";

const cestas = [
  {
    id: 1,
    nome: "Cesta Amanhecer Premium",
    preco: "185,00",
    imagem: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=500",
    itens: ["Suco de Laranja Natural", "Caneca de Porcelana", "Croissants Amanteigados", "Geleia Artesanal", "Frutas da Estação", "Cartão Personalizado"]
  },
  {
    id: 2,
    nome: "Cesta Paixão & Vinho",
    preco: "250,00",
    imagem: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=500",
    itens: ["Vinho Tinto Reservado", "Tábua de Queijos", "Torradas Finas", "Bombons Ferrero", "Cesta de Vime Decorada", "Arranjo de Rosas"]
  }
];

export default function Home() {
  const [modalAberto, setModalAberto] = useState(false);
  const [cestaSelecionada, setCestaSelecionada] = useState(null);

  // Função corrigida e fechada corretamente
  const abrirFormulario = (cesta) => {
    setCestaSelecionada(cesta);
    setModalAberto(true);
  };

  return (
    <main className="min-h-screen bg-soft">
      {/* Cabeçalho */}
      <header className="w-full bg-primary py-12 px-4 border-b-4 border-secondary shadow-2xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-secondary tracking-widest">
            Lígia Cestas & Presentes
          </h1>
          <p className="mt-3 text-accent italic text-lg md:text-2xl font-light tracking-wide">
            Momentos Inesquecíveis
          </p>
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="h-[1px] w-16 bg-secondary/40"></div>
            <span className="text-secondary">✦</span>
            <div className="h-[1px] w-16 bg-secondary/40"></div>
          </div>
        </div>
      </header>

      {/* Seção de Cards */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-serif text-primary text-center mb-12 uppercase tracking-[0.2em]">
          Nossos Cardápios
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cestas.map((cesta) => (
            <div key={cesta.id} className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-accent/20 hover:scale-[1.02] transition-transform duration-300">
              <div className="bg-primary p-4 text-center">
                <h3 className="text-xl font-serif font-bold text-secondary uppercase tracking-tight">
                  {cesta.nome}
                </h3>
              </div>
              <div className="h-64 overflow-hidden">
                <img src={cesta.imagem} alt={cesta.nome} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="text-center mb-6">
                  <span className="text-sm text-gray-500 block uppercase italic font-medium">Investimento</span>
                  <span className="text-3xl font-bold text-primary">R$ {cesta.preco}</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-secondary font-bold uppercase text-xs mb-3 tracking-widest border-b border-secondary/20 pb-1">
                    O que contém:
                  </h4>
                  <ul className="space-y-2 mb-8">
                    {cesta.itens.map((item, index) => (
                      <li key={index} className="text-gray-700 text-sm flex items-center gap-2">
                        <span className="text-accent text-xs">❤</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Botão conectado à função abrirFormulario */}
                <button 
                  onClick={() => abrirFormulario(cesta)}
                  className="w-full bg-secondary text-primary font-bold py-4 rounded-lg hover:bg-[#c29d2f] transition-colors shadow-lg uppercase tracking-widest text-sm"
                >
                  Quero Essa
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal do Formulário */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
              <h3 className="font-serif font-bold text-primary italic">Pedido: {cestaSelecionada?.nome}</h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 text-2xl px-2 hover:text-primary transition-colors">✕</button>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Seu Nome</label>
                <input type="text" className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Quem está pedindo?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Data</label>
                  <input type="date" className="w-full border border-gray-200 p-3 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Horário</label>
                  <input type="time" className="w-full border border-gray-200 p-3 rounded-lg outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Endereço de Entrega</label>
                <textarea className="w-full border border-gray-200 p-3 rounded-lg outline-none" rows={2} placeholder="Rua, número, bairro e ponto de referência"></textarea>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-lg shadow-lg hover:bg-green-700 transition">
                AVANÇAR PARA O PAGAMENTO
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}