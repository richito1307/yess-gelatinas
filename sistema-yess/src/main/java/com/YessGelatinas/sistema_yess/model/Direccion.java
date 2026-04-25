package com.YessGelatinas.sistema_yess.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Direcciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(length = 50)
    private String alias;

    @Column(length = 200, nullable = false)
    private String calle;

    @Column(length = 100)
    private String colonia;

    @Column(length = 100, nullable = false)
    private String ciudad;

    @Column(length = 100)
    private String estado;

    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    @Column(columnDefinition = "TEXT")
    private String referencias;

    @Column(name = "es_principal", nullable = false)
    private Boolean esPrincipal = false;
}
