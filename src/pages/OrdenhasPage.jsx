import React, { useEffect, useState } from "react";
import { animalService } from "../services/animais";
import { ordenhaService } from "../services/ordenhas";

export function OrdenhasPage() {
  const [ordenhas, setOrdenhas] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [animalId, setAnimalId] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [turno, setTurno] = useState("manha");
  const [litros, setLitros] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [observacao, setObservacao] = useState("");

  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [listaOrdenhas, listaAnimais] = await Promise.all([
        ordenhaService.listar().catch(() => []),
        animalService.listar().catch(() => []),
      ]);

      setOrdenhas(listaOrdenhas);
      setAnimais(listaAnimais);
      if (listaAnimais.length > 0 && !animalId) {
        setAnimalId(listaAnimais[0].id);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    // Payload estruturado exatamente conforme a documentação da API
    const payload = {
      animal: { 
        id: animalId 
      },
      data: data,          // Formato "YYYY-MM-DD"
      turno:turno,         // "manha" ou "tarde"
      litros: parseFloat(litros),
      temperatura: temperatura ? parseFloat(temperatura) : null,
      operadorId: "123e4567-e89b-12d3-a456-426614174000", // UUID válido para o operador
      observacao,
    };

    console.log("Enviando payload para ordenhas:", payload);

    try {
      await ordenhaService.criar(payload);
      setFeedback({ type: "success", message: "Ordenha registrada com sucesso!" });
      setLitros("");
      setTemperatura("");
      setObservacao("");
      carregarDados();
    } catch (err) {
      console.error("Erro retornado pela API:", err);
      setFeedback({ type: "error", message: err.message || "Erro ao registrar ordenha." });
    }
  };


  const handleDeletar = async (id) => {
    if (confirm("Deseja realmente excluir este registro de ordenha?")) {
      try {
        await ordenhaService.deletar(id);
        carregarDados();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const obterAnimalInfo = (animalRelacionado) => {
    if (!animalRelacionado) return "Animal desconhecido";
    const idBusca = typeof animalRelacionado === "object" ? animalRelacionado.id : animalRelacionado;
    const animalEncontrado = animais.find((a) => a.id === idBusca);
    if (animalEncontrado) {
      return `${animalEncontrado.nome} (Brinco: ${animalEncontrado.brinco})`;
    }
    return "ID: " + idBusca;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Formulário de Registro */}
      <div className="bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_#18181b] p-6 rounded-xl">
        <h2 className="text-lg font-black text-zinc-900 mb-4">Registrar Nova Ordenha</h2>

        {feedback.message && (
          <div
            className={`mb-6 p-4 border-2 border-zinc-900 rounded-lg font-bold text-sm ${
              feedback.type === "success"
                ? "bg-emerald-100 text-emerald-900"
                : "bg-rose-100 text-rose-900"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
              Animal
            </label>
            <select
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              className="w-full px-3 py-2 border-2 border-zinc-900 rounded-lg bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              {animais.length === 0 ? (
                <option value="">Nenhum animal cadastrado</option>
              ) : (
                animais.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome} (Brinco: {a.brinco})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
              Data
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3 py-2 border-2 border-zinc-900 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
              Turno
            </label>
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              className="w-full px-3 py-2 border-2 border-zinc-900 rounded-lg bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
              Litros Produzidos
            </label>
            <input
              type="number"
              step="0.01"
              value={litros}
              onChange={(e) => setLitros(e.target.value)}
              placeholder="Ex: 15.5"
              className="w-full px-3 py-2 border-2 border-zinc-900 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
              Temperatura (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={temperatura}
              onChange={(e) => setTemperatura(e.target.value)}
              placeholder="Ex: 36.5"
              className="w-full px-3 py-2 border-2 border-zinc-900 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
              Observação
            </label>
            <input
              type="text"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Produção normal"
              className="w-full px-3 py-2 border-2 border-zinc-900 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold border-2 border-zinc-900 rounded-lg shadow-[2px_2px_0px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              + Salvar Registro de Ordenha
            </button>
          </div>
        </form>
      </div>

      {/* Histórico */}
      <div className="bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_#18181b] p-6 rounded-xl">
        <h2 className="text-lg font-black text-zinc-900 mb-4">Histórico de Leite Coletado</h2>

        {loading ? (
          <p className="text-zinc-600 font-medium">Carregando histórico...</p>
        ) : ordenhas.length === 0 ? (
          <p className="text-zinc-500 italic">Nenhum registro de ordenha encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900 text-left bg-zinc-50">
                  <th className="p-3 font-bold text-xs uppercase text-zinc-700">Data</th>
                  <th className="p-3 font-bold text-xs uppercase text-zinc-700">Animal</th>
                  <th className="p-3 font-bold text-xs uppercase text-zinc-700">Turno</th>
                  <th className="p-3 font-bold text-xs uppercase text-zinc-700">Litros</th>
                  <th className="p-3 font-bold text-xs uppercase text-zinc-700">Temp</th>
                  <th className="p-3 font-bold text-xs uppercase text-zinc-700">Observação</th>
                  <th className="p-3 font-bold text-xs uppercase text-zinc-700 text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {ordenhas.map((o) => (
                  <tr key={o.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                    <td className="p-3 font-medium text-sm text-zinc-900">{o.data}</td>
                    <td className="p-3 font-medium text-sm text-zinc-900">{obterAnimalInfo(o.animal)}</td>
                    <td className="p-3 font-bold text-sm text-zinc-700 capitalize">{o.turno}</td>
                    <td className="p-3 font-black text-sm text-emerald-700">{o.litros} L</td>
                    <td className="p-3 text-sm text-zinc-600">
                      {o.temperatura ? `${o.temperatura} °C` : "-"}
                    </td>
                    <td className="p-3 text-sm text-zinc-500 italic">{o.observacao || "-"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeletar(o.id)}
                        className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 border-2 border-zinc-900 rounded shadow-[2px_2px_0px_0px_#18181b] active:shadow-none transition-all cursor-pointer"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
