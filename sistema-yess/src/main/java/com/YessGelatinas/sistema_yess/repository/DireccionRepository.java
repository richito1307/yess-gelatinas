package com.YessGelatinas.sistema_yess.repository;

import com.YessGelatinas.sistema_yess.model.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DireccionRepository extends JpaRepository<Direccion, Integer> {
    List<Direccion> findByClienteId(Integer clienteId);
}
