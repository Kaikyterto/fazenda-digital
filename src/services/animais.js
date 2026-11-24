
const API_BASE_URL = "https://fazenda-digital-api.onrender.com/api/v1";

export const animalService = {

  async listar() {
    const response = await fetch(`${API_BASE_URL}/animals`);
    if (!response.ok) {
      throw new Error('Erro ao buscar a lista de animais.');
    }
    return response.json();
  },


  async buscarPorId(id) {
    const response = await fetch(`${API_BASE_URL}/animals/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Animal não encontrado.');
      }
      throw new Error('Erro ao buscar os detalhes do animal.');
    }
    return response.json();
  },

 
  async criar(dadosAnimal) {
    const response = await fetch(`${API_BASE_URL}/animals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosAnimal),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao cadastrar animal.');
    }

    return response.json();
  },

  async atualizar(id, dadosAnimal) {
    const response = await fetch(`${API_BASE_URL}/animals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosAnimal),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao atualizar dados do animal.');
    }

    return response.json();
  },

  
  async deletar(id) {
    const response = await fetch(`${API_BASE_URL}/animals/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 204 || response.ok) {
      return true;
    }

    throw new Error('Erro ao remover o animal do sistema.');
  },
};