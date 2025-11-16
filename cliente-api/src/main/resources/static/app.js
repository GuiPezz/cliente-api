// ========================
//      CONFIGURAÇÃO
// ========================
const BASE_CLIENTES = "http://localhost:8080/api/clientes";
const BASE_AGENDAMENTOS = "http://localhost:8080/api/agendamentos";

// ========================
//      UTILITÁRIOS
// ========================
function formatarData(iso) {
    if (!iso) return "";
    const data = new Date(iso);
    return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR");
}


// ========================
//   CRUD CLIENTES
// ========================

async function listarClientes() {
    try {
        const res = await fetch(BASE_CLIENTES);
        if (!res.ok) throw new Error("Erro ao buscar clientes");
        const clientes = await res.json();
        
        renderizarClientes(clientes);
        
        // CORREÇÃO: Adicionado para preencher o dropdown
        carregarClientesSelect(clientes); 
    
    } catch (error) {
        console.error("Falha em listarClientes:", error);
        alert("Não foi possível carregar os clientes.");
    }
}

async function criarCliente(data) {
    try {
        await fetch(BASE_CLIENTES, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error("Falha em criarCliente:", error);
        alert("Erro ao criar cliente.");
    }
}

async function atualizarCliente(id, data) {
    try {
        await fetch(`${BASE_CLIENTES}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error("Falha em atualizarCliente:", error);
        alert("Erro ao atualizar cliente.");
    }
}

async function deletarCliente(id) {
    if (!confirm("Tem certeza que deseja deletar?")) return;
    
    try {
        await fetch(`${BASE_CLIENTES}/${id}`, { method: "DELETE" });
        listarClientes(); // Recarrega clientes e dropdown
    
    } catch (error) {
        console.error("Falha em deletarCliente:", error);
        alert("Erro ao deletar cliente.");
    }
}

function renderizarClientes(clientes) {
    const tabelaBody = document.getElementById('tabela-clientes-body');
    tabelaBody.innerHTML = "";

    clientes.forEach(c => {
        tabelaBody.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.nome}</td>
                <td>${c.email}</td>
                <td>${formatarData(c.dataCadastro)}</td>
                <td>
                    <button class='btn-editar' onclick='preencherFormulario(${JSON.stringify(c)})'>Editar</button>
                    <button class='btn-deletar' onclick='deletarCliente(${c.id})'>Deletar</button>
                </td>
            </tr>
        `;
    });
}

function preencherFormulario(cliente) {
    document.getElementById("cliente-id").value = cliente.id;
    document.getElementById("nome").value = cliente.nome;
    document.getElementById("email").value = cliente.email;
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("observacoes").value = cliente.observacoes;

    document.getElementById("btn-salvar").textContent = "Atualizar Cliente";
}


// ==============================
// FORM CLIENTE
// ==============================

document.getElementById("form-cliente").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("cliente-id").value;

    const data = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        observacoes: document.getElementById("observacoes").value
    };

    try {
        if (id) {
            await atualizarCliente(id, data);
        } else {
            await criarCliente(data);
        }

        e.target.reset();
        document.getElementById("btn-salvar").textContent = "Salvar Cliente";
        listarClientes(); // Recarrega clientes e dropdown
    
    } catch (error) {
        console.error("Falha ao salvar cliente:", error);
        alert("Erro ao salvar cliente.");
    }
});


// ==============================
//   CRUD AGENDAMENTOS
// ==============================

// CARREGAR O SELECT DE CLIENTES
function carregarClientesSelect(clientes) {
    const select = document.getElementById("ag-cliente");

    if (!select) {
        console.error("ERRO: elemento #ag-cliente não existe no HTML");
        return;
    }

    select.innerHTML = "<option value=''>Selecione um cliente</option>"; // Adiciona uma opção padrão

    clientes.forEach(cli => {
        select.innerHTML += `<option value="${cli.id}">${cli.nome}</option>`;
    });
}


// CRIAR AGENDAMENTO
async function criarAgendamento() {
    
    const dto = {
        clienteId: document.getElementById("ag-cliente").value,
        dataHora: document.getElementById("ag-dataHora").value,
        servico: document.getElementById("ag-servico").value,
        observacoes: document.getElementById("ag-observacoes").value
    };

    // Validação simples
    if (!dto.clienteId || !dto.dataHora || !dto.servico) {
        alert("Por favor, preencha Cliente, Data/Hora e Serviço.");
        return;
    }

    try {
        await fetch(BASE_AGENDAMENTOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        // Limpa o formulário de agendamento após o sucesso
        document.getElementById("ag-cliente").value = "";
        document.getElementById("ag-dataHora").value = "";
        document.getElementById("ag-servico").value = "";
        document.getElementById("ag-observacoes").value = "";

        listarAgendamentos();

    } catch (error) {
        console.error("Falha em criarAgendamento:", error);
        alert("Erro ao criar agendamento.");
    }
}


// LISTAR AGENDAMENTOS
async function listarAgendamentos() {
    try {
        const res = await fetch(BASE_AGENDAMENTOS);
        if (!res.ok) throw new Error("Erro ao buscar agendamentos");
        const lista = await res.json();

        const tabela = document.getElementById("agendamentos-table");
        tabela.innerHTML = "";

        lista.forEach(a => {
            tabela.innerHTML += `
                <tr>
                    <td>${a.id}</td>
                    <td>${a.cliente.nome}</td>
                    <td>${formatarData(a.dataHora)}</td>
                    <td>${a.servico}</td>
                    <td>${a.observacoes || ""}</td>
                    <td>
                        <button class='btn-deletar' onclick='deletarAgendamento(${a.id})'>Excluir</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Falha em listarAgendamentos:", error);
        alert("Erro ao carregar agendamentos.");
    }
}

async function deletarAgendamento(id) {
    if (!confirm("Confirmar exclusão?")) return;

    try {
        await fetch(`${BASE_AGENDAMENTOS}/${id}`, { method: "DELETE" });
        listarAgendamentos();
    } catch (error) {
        console.error("Falha em deletarAgendamento:", error);
        alert("Erro ao deletar agendamento.");
    }
}


// ==============================
// INICIALIZAÇÃO
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    listarClientes();
    listarAgendamentos();

    // CORREÇÃO: Adicionado o listener para o botão de agendar
    document.getElementById("btn-agendar").addEventListener("click", criarAgendamento);
});