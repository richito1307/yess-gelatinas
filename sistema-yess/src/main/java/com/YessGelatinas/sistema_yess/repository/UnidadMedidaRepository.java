package com.YessGelatinas.sistema_yess.repository;

import com.YessGelatinas.sistema_yess.model.UnidadMedida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnidadMedidaRepository extends JpaRepository<UnidadMedida, Integer> {
}
