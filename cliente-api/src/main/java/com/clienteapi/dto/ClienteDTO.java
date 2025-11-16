package com.clienteapi.dto;

import jakarta.validation.constraints.*;

public class ClienteDTO {

    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 120)
    private String nome;

    @NotBlank(message = "O email é obrigatório")
    @Email
    @Size(max = 150)
    private String email;

    @NotBlank(message = "O telefone é obrigatório")
    @Size(max = 20)
    private String telefone;

    @Size(max = 255)
    private String observacoes;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
