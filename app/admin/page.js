"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminGestao() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const [senhaInput, setSenhaInput] = useState("");

  // Altere para a senha que desejar
  const SENHA_MESTRA = "belaedom10";

  const verificarSenha = (e) => {
    e.preventDefault();
    if (senhaInput === SENHA_MESTRA) {
      setAutorizado(true);
    } else {
      alert("Senha incorreta!");
    }
  };

  async function fetchReservas() {
    // Usamos o setLoading apenas se já estivermos autorizados para evitar flashes
    const { data, error } = await supabase
      .from("rifas")
      .select("*")
      .order("numero", { ascending: true });

    if (!error) setReservas(data);
    setLoading(false);
  }

  useEffect(() => {
    let isMounted = true;

    if (autorizado) {
      const carregarDados = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("rifas")
          .select("*")
          .order("numero", { ascending: true });

        if (isMounted) {
          if (!error) setReservas(data);
          setLoading(false);
        }
      };
      carregarDados();
    }

    return () => {
      isMounted = false;
    };
  }, [autorizado]);

  async function atualizarStatus(id, novoStatus) {
    const { error } = await supabase
      .from("rifas")
      .update({ status: novoStatus })
      .eq("id", id);
    if (!error) fetchReservas();
  }

  async function excluirReserva(id) {
    const { error } = await supabase.from("rifas").delete().eq("id", id);
    if (!error) fetchReservas();
  }

  // 1. TELA DE LOGIN (Bloqueio)
  if (!autorizado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm border border-gray-200">
          <h2 className="text-[#630d16] font-bold text-center mb-6 uppercase tracking-widest text-sm">
            Acesso Restrito
          </h2>
          <form onSubmit={verificarSenha} className="space-y-4">
            <input
              type="password"
              placeholder="Senha de administrador"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630d16] text-sm"
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-[#630d16] text-white py-2 rounded-lg font-bold hover:bg-[#80121c] transition-all text-xs"
            >
              ENTRAR NO PAINEL
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. LOADING (Apenas após senha correta)
  if (loading)
    return (
      <div className="p-10 text-center text-sm font-mono italic text-gray-500">
        Sincronizando dados...
      </div>
    );

  // 3. PAINEL DE GESTÃO (Conteúdo Original)
  return (
    <div className="p-2 md:p-6 w-full max-w-[1600px] mx-auto bg-gray-50 min-h-screen">
      <header className="mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#630d16]">
        <div>
          <h1 className="text-lg font-bold text-[#630d16] uppercase tracking-tight">
            Gestão Sorteio Dia das Mães
          </h1>
          <div className="text-[10px] text-gray-400 font-mono">
            Total: {reservas.length} registros | Modo Administrador
          </div>
        </div>
        <button
          onClick={() => setAutorizado(false)}
          className="text-[9px] bg-gray-100 hover:bg-red-50 hover:text-red-600 px-3 py-1 rounded text-gray-500 font-bold transition-colors"
        >
          SAIR
        </button>
      </header>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left table-auto">
          <thead className="bg-[#630d16] text-white text-[11px] uppercase">
            <tr>
              <th className="px-3 py-2">Nº</th>
              <th className="px-3 py-2">Comprador</th>
              <th className="px-3 py-2">Presenteado</th>
              <th className="px-3 py-2">WhatsApp</th>
              <th className="px-3 py-2">Endereço</th>
              <th className="px-3 py-2 text-center">Status</th>
              <th className="px-3 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservas.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-3 py-1 font-bold text-[#630d16] text-sm">
                  {item.numero.toString().padStart(2, "0")}
                </td>
                <td className="px-3 py-1 text-xs font-semibold text-gray-700 truncate max-w-[150px]">
                  {item.nome_comprador}
                </td>
                <td className="px-3 py-1 text-[11px] text-gray-500 italic truncate max-w-[150px]">
                  {item.nome_presenteado || "-"}
                </td>
                <td className="px-3 py-1 text-[11px] font-mono text-blue-600">
                  <a
                    href={`https://wa.me/55${item.telefone?.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.telefone}
                  </a>
                </td>
                <td
                  className="px-3 py-1 text-[10px] text-gray-400 truncate max-w-[200px]"
                  title={item.endereco}
                >
                  {item.endereco}
                </td>
                <td className="px-3 py-1 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      item.status === "pago"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-1 text-right">
                  <div className="flex justify-end gap-3 items-center">
                    {item.status !== "pago" && (
                      <button
                        onClick={() => atualizarStatus(item.id, "pago")}
                        className="text-green-600 hover:text-green-800 text-[10px] font-bold underline"
                      >
                        PAGO
                      </button>
                    )}
                    <button
                      onClick={() =>
                        confirm(`Liberar o nº ${item.numero}?`) &&
                        excluirReserva(item.id)
                      }
                      className="text-gray-300 hover:text-red-500 text-[9px] transition-colors"
                    >
                      EXCLUIR
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
