package com.clienteapi.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class AgendamentoDTO {

    @NotNull
    private LocalDateTime dataHora;

    @NotNull
    private String servico;

    private String observacoes;

    @NotNull
    private Long clienteId;

    // Getters e Setters
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public String getServico() { return servico; }
    public void setServico(String servico) { this.servico = servico; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
}
