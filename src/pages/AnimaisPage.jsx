import React, { useEffect, useState } from "react";
import { animalService } from "../services/animais";

export function AnimaisPage() {
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Estados do formulário de cadastro rápido
  const [nome, setNome] = useState("");
  const [brinco, setBrinco] = useState("");
  const [raca, setRaca] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("femea");
  const [status, setStatus] = useState("em_lactacao");

  const carregarAnimais = async () => {
    try {
      setLoading(true);
      const dados = await animalService.listar();
      setAnimais(dados || []);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAnimais();
  }, []);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fazendaId: "00000000-0000-0000-0000-000000000001",
        nome,
        brinco,
        raca,
        dataNascimento: "2023-01-01", // Ou crie um input para capturar esta data se o backend for rigoroso
        sexo: "femea",
        status,
        fotoUrl: ""
      };

      console.log("Enviando payload para /api/v1/animals:", payload);

      await animalService.criar(payload);
      
      setNome("");
      setBrinco("");
      setRaca("");
      carregarAnimais();
    } catch (err) {
      console.error("Erro detalhado ao cadastrar animal:", err);
      const mensagemErro = err.response?.data?.message || err.message || "Erro 400: Dados inválidos ao cadastrar animal.";
      alert(mensagemErro);
    }
  };


  const handleDeletar = async (id) => {
    if (confirm("Deseja realmente remover este animal?")) {
      try {
        await animalService.deletar(id);
        carregarAnimais();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Formulário de Cadastro Simples */}
      <form onSubmit={handleCadastrar} className="bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_#18181b] p-6 rounded-xl grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Nome</label>
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            placeholder="Ex: Mimosa" 
            required
            className="w-full px-3 py-2 border-2 border-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Brinco</label>
          <input 
            type="text" 
            value={brinco} 
            onChange={(e) => setBrinco(e.target.value)} 
            placeholder="Ex: 12345" 
            required
            className="w-full px-3 py-2 border-2 border-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Raça</label>
          <input 
            type="text" 
            value={raca} 
            onChange={(e) => setRaca(e.target.value)} 
            placeholder="Ex: Holandesa" 
            required
            className="w-full px-3 py-2 border-2 border-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Nascimento</label>
          <input 
            type="date" 
            value={dataNascimento} 
            onChange={(e) => setDataNascimento(e.target.value)} 
            required
            className="w-full px-3 py-2 border-2 border-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">Status</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border-2 border-zinc-900 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="em_lactacao">Em Lactação</option>
            <option value="gestante">Gestante</option>
            <option value="seca">Seca</option>
          </select>
        </div>
        <button 
          type="submit"
          className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold border-2 border-zinc-900 rounded-lg shadow-[2px_2px_0px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          + Cadastrar
        </button>
      </form>

      {/* Listagem */}
      {loading ? (
        <p className="text-zinc-600 font-medium">Carregando animais...</p>
      ) : erro ? (
        <p className="text-rose-600 font-bold">{erro}</p>
      ) : animais.length === 0 ? (
        <p className="text-zinc-500 italic">Nenhum animal cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {animais.map((animal) => (
            <div key={animal.id} className="bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_#18181b] p-5 rounded-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-black text-zinc-900">{animal.nome}</h3>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold border-2 border-zinc-900 rounded">
                    Brinco: {animal.brinco}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 mt-1">Raça: {animal.raca}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mt-2">Status: {animal.status}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-zinc-100">
                <span className="text-xs text-zinc-400 font-mono truncate max-w-[180px]">ID: {animal.id}</span>
                <button 
                  onClick={() => handleDeletar(animal.id)}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border-2 border-zinc-900 rounded-lg shadow-[2px_2px_0px_0px_#18181b] active:shadow-none transition-all cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}