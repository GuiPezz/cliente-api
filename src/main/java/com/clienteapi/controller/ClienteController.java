package com.clienteapi.controller;

import com.clienteapi.dto.ClienteDTO;
import com.clienteapi.exception.NotFoundException;
import com.clienteapi.model.Cliente;
import com.clienteapi.repository.ClienteRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@Tag(name = "Clientes", description = "Endpoints para gerenciamento de clientes")
public class ClienteController {

    private final ClienteRepository repository;

    public ClienteController(ClienteRepository repository) {
        this.repository = repository;
    }

    // POST - Criar cliente
    @Operation(summary = "Cadastrar novo cliente")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Cliente criado com sucesso"),
        @ApiResponse(responseCode = "422", description = "Erro de validação")
    })
    @PostMapping
    public ResponseEntity<Cliente> criar(@Valid @RequestBody ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.getNome());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefone(dto.getTelefone());
        cliente.setObservacoes(dto.getObservacoes());
        Cliente salvo = repository.save(cliente);
        return ResponseEntity.created(URI.create("/api/clientes/" + salvo.getId())).body(salvo);
    }

    // GET - Listar todos
    @Operation(summary = "Listar todos os clientes")
    @ApiResponse(responseCode = "200", description = "Lista de clientes retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<Cliente>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    // GET - Buscar por ID
    @Operation(summary = "Buscar cliente por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
        @ApiResponse(responseCode = "404", description = "Cliente não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Long id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente ID " + id + " não encontrado"));
        return ResponseEntity.ok(cliente);
    }

    // PUT - Atualizar cliente
    @Operation(summary = "Atualizar cliente existente")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cliente atualizado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Cliente não encontrado"),
        @ApiResponse(responseCode = "422", description = "Erro de validação")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizar(@PathVariable Long id, @Valid @RequestBody ClienteDTO dto) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente ID " + id + " não encontrado"));
        cliente.setNome(dto.getNome());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefone(dto.getTelefone());
        cliente.setObservacoes(dto.getObservacoes());
        return ResponseEntity.ok(repository.save(cliente));
    }

    // DELETE - Remover cliente
    @Operation(summary = "Excluir cliente por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Cliente excluído com sucesso"),
        @ApiResponse(responseCode = "404", description = "Cliente não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente ID " + id + " não encontrado"));
        repository.delete(cliente);
        return ResponseEntity.noContent().build();
    }
}
