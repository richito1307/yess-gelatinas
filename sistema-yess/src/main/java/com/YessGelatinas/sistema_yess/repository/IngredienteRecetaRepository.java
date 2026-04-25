package com.YessGelatinas.sistema_yess.repository;

import com.YessGelatinas.sistema_yess.model.IngredienteReceta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredienteRecetaRepository extends JpaRepository<IngredienteReceta, Integer> {
}

