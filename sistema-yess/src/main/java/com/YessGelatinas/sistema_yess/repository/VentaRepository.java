package com.YessGelatinas.sistema_yess.repository;

import com.YessGelatinas.sistema_yess.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {
}

