package com.YessGelatinas.sistema_yess.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "unidades_medida")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnidadMedida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 20, nullable = false)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoUnidad tipo;

    @Column(name = "factor_conversion", precision = 10, scale = 6, nullable = false)
    private BigDecimal factorConversion;

    public enum TipoUnidad {
        masa,
        volumen
    }
}
