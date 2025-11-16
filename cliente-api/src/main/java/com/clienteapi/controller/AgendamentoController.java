package com.clienteapi.controller;

import com.clienteapi.dto.AgendamentoDTO;
import com.clienteapi.model.Agendamento;
import com.clienteapi.model.Cliente;
import com.clienteapi.repository.AgendamentoRepository;
import com.clienteapi.repository.ClienteRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@Tag(name = "Agendamentos", description = "CRUD de agendamentos de clientes")
public class AgendamentoController {

    private final AgendamentoRepository agendamentoRepository;
    private final ClienteRepository clienteRepository;

    public AgendamentoController(AgendamentoRepository agendamentoRepository,
                                 ClienteRepository clienteRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.clienteRepository = clienteRepository;
    }

    @PostMapping
    @Operation(summary = "Criar agendamento")
    public ResponseEntity<Agendamento> criar(@Valid @RequestBody AgendamentoDTO dto) {

        Cliente cliente = clienteRepository.findById(dto.getClienteId()).orElse(null);

        if (cliente == null) {
            return ResponseEntity.notFound().build();
        }

        Agendamento ag = new Agendamento();
        ag.setDataHora(dto.getDataHora());
        ag.setServico(dto.getServico());
        ag.setObservacoes(dto.getObservacoes());
        ag.setCliente(cliente);

        Agendamento salvo = agendamentoRepository.save(ag);

        return ResponseEntity.created(URI.create("/api/agendamentos/" + salvo.getId()))
                .body(salvo);
    }

    @GetMapping
    @Operation(summary = "Listar agendamentos")
    public ResponseEntity<List<Agendamento>> listar() {
        return ResponseEntity.ok(agendamentoRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar agendamento por ID")
    public ResponseEntity<Agendamento> buscar(@PathVariable Long id) {
        Agendamento ag = agendamentoRepository.findById(id).orElse(null);

        if (ag == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(ag);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir agendamento")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Agendamento ag = agendamentoRepository.findById(id).orElse(null);

        if (ag == null) {
            return ResponseEntity.notFound().build();
        }

        agendamentoRepository.delete(ag);
        return ResponseEntity.noContent().build();
    }
}
