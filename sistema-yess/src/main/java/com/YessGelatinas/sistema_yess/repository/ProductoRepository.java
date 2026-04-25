package com.YessGelatinas.sistema_yess.repository;

import com.YessGelatinas.sistema_yess.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
}