// ========================
//      CONFIGURAÇÃO
// ========================
const BASE_CLIENTES = "http://localhost:8080/api/clientes";
const BASE_AGENDAMENTOS = "http://localhost:8080/api/agendamentos";

const tabelaBody = document.getElementById('tabela-clientes-body');


// ========================
//      UTILITÁRIOS
// ========================
function formatarData(iso) {
    if (!iso) return "";
    const data = new Date(iso);
    return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR");
}


// ========================
//   CRUD DE CLIENTES
// ========================

// Listar clientes
async function listarClientes() {
    const res = await fetch(BASE_CLIENTES);
    const clientes = await res.json();
    renderizarClientes(clientes);
    carregarClientesSelect();
}

// Criar cliente
async function criarCliente(data) {
    await fetch(BASE_CLIENTES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    alert("Cliente criado com sucesso!");
}

// Atualizar cliente
async function atualizarCliente(id, data) {
    await fetch(`${BASE_CLIENTES}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    alert("Cliente atualizado!");
}

// Deletar cliente
async function deletarCliente(id) {
    if (!confirm("Tem certeza que deseja deletar?")) return;

    await fetch(`${BASE_CLIENTES}/${id}`, { method: "DELETE" });
    alert("Cliente removido!");
    listarClientes();
}


// Renderizar tabela de clientes
function renderizarClientes(clientes) {
    tabelaBody.innerHTML = "";

    clientes.forEach(c => {
        let linha = `
            <tr>
                <td>${c.id}</td>
                <td>${c.nome}</td>
                <td>${c.email}</td>
                <td>${formatarData(c.dataCadastro)}</td>
                <td>
                    <button class='btn-editar' onclick='preencherFormulario(${JSON.stringify(JSON.stringify(c))})'>Editar</button>
                    <button class='btn-deletar' onclick='deletarCliente(${c.id})'>Deletar</button>
                </td>
            </tr>
        `;
        linha = linha.replace(/\"/g, "'");
        tabelaBody.innerHTML += linha;
    });
}

// Preencher formulário cliente
function preencherFormulario(clienteStr) {
    const cliente = JSON.parse(clienteStr);

    document.getElementById("cliente-id").value = cliente.id;
    document.getElementById("nome").value = cliente.nome;
    document.getElementById("email").value = cliente.email;
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("observacoes").value = cliente.observacoes;

    document.getElementById("btn-salvar").textContent = "Atualizar Cliente";
}


// Enviar formulário cliente
document.getElementById("form-cliente").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("cliente-id").value;

    const data = {
        nome: nome.value,
        email: email.value,
        telefone: telefone.value,
        observacoes: observacoes.value
    };

    if (id) await atualizarCliente(id, data);
    else await criarCliente(data);

    formCliente.reset();
    listarClientes();
});



// ==============================
//        CRUD AGENDAMENTOS
// ==============================

// Preencher select com clientes
async function carregarClientesSelect() {
    const res = await fetch(BASE_CLIENTES);
    const clientes = await res.json();

    const select = document.getElementById("ag-cliente");
    select.innerHTML = "";

    clientes.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
    });
}


// Criar agendamento
async function criarAgendamento() {
    const dto = {
        clienteId: document.getElementById("ag-cliente").value,
        dataHora: document.getElementById("ag-dataHora").value,
        servico: document.getElementById("ag-servico").value,
        observacoes: document.getElementById("ag-observacoes").value
    };

    await fetch(BASE_AGENDAMENTOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
    });

    alert("Agendamento criado!");
    listarAgendamentos();
}

// Listar agendamentos
async function listarAgendamentos() {
    const res = await fetch(BASE_AGENDAMENTOS);
    const lista = await res.json();

    const tabela = document.getElementById("agendamentos-table");
    tabela.innerHTML = "";

    lista.forEach(a => {
        tabela.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td>${a.cliente.nome}</td>
                <td>${a.dataHora.replace("T", " ")}</td>
                <td>${a.servico}</td>
                <td>${a.observacoes || ""}</td>
                <td><button class='btn-deletar' onclick='deletarAgendamento(${a.id})'>Excluir</button></td>
            </tr>
        `;
    });
}

// Deletar agendamento
async function deletarAgendamento(id) {
    if (!confirm("Confirmar exclusão?")) return;

    await fetch(`${BASE_AGENDAMENTOS}/${id}`, { method: "DELETE" });

    alert("Agendamento removido!");
    listarAgendamentos();
}


// ===============================
//      INICIALIZAÇÃO DA PÁGINA
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    listarClientes();
    listarAgendamentos();
    carregarClientesSelect();
});
