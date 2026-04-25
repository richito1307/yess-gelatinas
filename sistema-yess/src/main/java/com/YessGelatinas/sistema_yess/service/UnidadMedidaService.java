package com.YessGelatinas.sistema_yess.service;

import com.YessGelatinas.sistema_yess.exception.ResourceNotFoundException;
import com.YessGelatinas.sistema_yess.model.UnidadMedida;
import com.YessGelatinas.sistema_yess.repository.UnidadMedidaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UnidadMedidaService {

    private final UnidadMedidaRepository unidadMedidaRepository;

    public UnidadMedidaService(UnidadMedidaRepository unidadMedidaRepository) {
        this.unidadMedidaRepository = unidadMedidaRepository;
    }

    public List<UnidadMedida> findAll() {
        return unidadMedidaRepository.findAll();
    }

    public UnidadMedida findById(Integer id) {
        return unidadMedidaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidad de medida no encontrada: " + id));
    }

    @Transactional
    public UnidadMedida save(UnidadMedida unidadMedida) {
        return unidadMedidaRepository.save(unidadMedida);
    }

    @Transactional
    public UnidadMedida update(Integer id, UnidadMedida unidadMedida) {
        UnidadMedida existing = findById(id);
        existing.setNombre(unidadMedida.getNombre());
        existing.setTipo(unidadMedida.getTipo());
        existing.setFactorConversion(unidadMedida.getFactorConversion());
        return unidadMedidaRepository.save(existing);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!unidadMedidaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Unidad de medida no encontrada: " + id);
        }
        unidadMedidaRepository.deleteById(id);
    }
}
