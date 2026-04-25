package com.YessGelatinas.sistema_yess.repository;

import com.YessGelatinas.sistema_yess.model.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Integer> {
}

