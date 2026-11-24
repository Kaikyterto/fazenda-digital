const API_BASE_URL = "https://fazenda-digital-api.onrender.com/api/v1";

export const ordenhaService = {
  async listar() {
    const res = await fetch(`${API_BASE_URL}/ordenhas`);
    if (!res.ok) {
      throw new Error("Erro ao buscar histórico de ordenhas.");
    }
    return res.json();
  },

  async criar(dadosOrdenha) {
    const res = await fetch(`${API_BASE_URL}/ordenhas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosOrdenha),
    });

    if (res.status === 201) {
      return res.json().catch(() => ({}));
    }

    const erroJson = await res.json().catch(() => ({}));

    if (res.status === 400) {
      throw new Error(erroJson.message || "Dados inválidos. Verifique a quantidade em litros ou o turno.");
    }

    if (res.status === 409) {
      throw new Error(erroJson.message || "Já existe uma ordenha registrada para este animal na mesma data e turno.");
    }

    throw new Error(erroJson.message || "Erro ao registrar a ordenha.");
  },

  async deletar(id) {
    const res = await fetch(`${API_BASE_URL}/ordenhas/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Erro ao excluir o registro de ordenha.");
    }
  }
};
