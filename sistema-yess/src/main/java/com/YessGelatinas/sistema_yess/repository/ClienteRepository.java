package com.YessGelatinas.sistema_yess.repository;

import com.YessGelatinas.sistema_yess.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    List<Cliente> findByActivoTrue();
    List<Cliente> findByNombreContainingIgnoreCaseAndActivoTrue(String nombre);
}
