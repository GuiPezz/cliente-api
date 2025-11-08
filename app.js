const BASE_URL = 'http://localhost:8080/api/clientes'; 
const tabelaBody = document.getElementById('tabela-clientes-body');
const formCliente = document.getElementById('form-cliente');

// --- Funções de Formatação ---
function formatarData(isoString) {
    if (!isoString) return 'N/A';
    // O ISO string do Java (ex: 2025-11-08T15:46:12.123)
    const data = new Date(isoString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
}

// --- Funções de Comunicação com a API ---

// GET - Listar todos os clientes
async function listarClientes() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const clientes = await response.json();
        renderizarClientes(clientes);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        alert('Falha ao carregar a lista de clientes. Verifique se a API está rodando na porta 8080.');
    }
}

// POST e PUT - Lógica de Submissão do Formulário
formCliente.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('cliente-id').value;
    const clienteData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        observacoes: document.getElementById('observacoes').value
    };

    if (id) {
        // Se há ID, é uma atualização (PUT)
        await atualizarCliente(id, clienteData);
    } else {
        // Se não há ID, é um novo cadastro (POST)
        await criarCliente(clienteData);
    }
    
    formCliente.reset(); // Limpa o formulário
    document.getElementById('cliente-id').value = ''; // Remove o ID escondido
    document.getElementById('btn-salvar').textContent = 'Salvar Cliente'; // Reseta o texto do botão
    listarClientes(); // Recarrega a lista
});

// POST - Criar novo cliente
async function criarCliente(data) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.status === 422) { // Erro de validação da API
            const validationErrors = await response.json();
            alert('Erro de Validação: ' + JSON.stringify(validationErrors));
        } else if (!response.ok) {
             throw new Error(`Falha ao criar cliente. Código: ${response.status}`);
        }
        alert('Cliente cadastrado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        alert(error.message);
    }
}

// PUT - Atualizar cliente
async function atualizarCliente(id, data) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.status === 404) {
            alert('Erro: Cliente não encontrado para atualização.');
        } else if (!response.ok) {
             throw new Error(`Falha ao atualizar cliente. Código: ${response.status}`);
        }
        alert('Cliente atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert(error.message);
    }
}

// DELETE - Remover cliente
async function deletarCliente(id) {
    if (!confirm('Tem certeza que deseja DELETAR este cliente? Esta ação é irreversível.')) return;
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 404) {
            alert('Erro: Cliente não encontrado para exclusão.');
        } else if (!response.ok && response.status !== 204) { // 204 No Content é o esperado para DELETE bem-sucedido
             throw new Error(`Falha ao deletar cliente. Código: ${response.status}`);
        }
        alert('Cliente deletado com sucesso!');
        listarClientes(); // Recarrega a lista
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        alert(error.message);
    }
}

// --- Funções de Renderização da Tabela ---

// Preenche o formulário para edição (baseado no GET {id})
function preencherFormulario(cliente) {
    document.getElementById('cliente-id').value = cliente.id;
    document.getElementById('nome').value = cliente.nome;
    document.getElementById('email').value = cliente.email;
    document.getElementById('telefone').value = cliente.telefone;
    document.getElementById('observacoes').value = cliente.observacoes;
    document.getElementById('btn-salvar').textContent = 'Atualizar Cliente';
    window.scrollTo(0, 0); // Leva o usuário de volta ao formulário
}

// Renderiza a lista de clientes na tabela
function renderizarClientes(clientes) {
    tabelaBody.innerHTML = ''; // Limpa a tabela
    if (clientes.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum cliente cadastrado.</td></tr>';
        return;
    }

    clientes.forEach(cliente => {
        const linha = tabelaBody.insertRow();
        linha.insertCell(0).textContent = cliente.id;
        linha.insertCell(1).textContent = cliente.nome;
        linha.insertCell(2).textContent = cliente.email;
        linha.insertCell(3).textContent = formatarData(cliente.dataCadastro);
        
        const celulaAcoes = linha.insertCell(4);
        
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn-editar';
        btnEditar.onclick = () => preencherFormulario(cliente); 
        celulaAcoes.appendChild(btnEditar);

        const btnDeletar = document.createElement('button');
        btnDeletar.textContent = 'Deletar';
        btnDeletar.className = 'btn-deletar';
        btnDeletar.onclick = () => deletarCliente(cliente.id); 
        celulaAcoes.appendChild(btnDeletar);
    });
}

// Inicializa a aplicação ao carregar a página
document.addEventListener('DOMContentLoaded', listarClientes);