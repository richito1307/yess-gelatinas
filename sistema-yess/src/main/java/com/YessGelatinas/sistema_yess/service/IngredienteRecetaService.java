package com.YessGelatinas.sistema_yess.service;

import com.YessGelatinas.sistema_yess.exception.ResourceNotFoundException;
import com.YessGelatinas.sistema_yess.model.IngredienteReceta;
import com.YessGelatinas.sistema_yess.repository.IngredienteRecetaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class IngredienteRecetaService {

    private final IngredienteRecetaRepository ingredienteRecetaRepository;

    public IngredienteRecetaService(IngredienteRecetaRepository ingredienteRecetaRepository) {
        this.ingredienteRecetaRepository = ingredienteRecetaRepository;
    }

    public List<IngredienteReceta> findAll() {
        return ingredienteRecetaRepository.findAll();
    }

    public IngredienteReceta findById(Integer id) {
        return ingredienteRecetaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingrediente de receta no encontrado: " + id));
    }

    @Transactional
    public IngredienteReceta save(IngredienteReceta ingredienteReceta) {
        return ingredienteRecetaRepository.save(ingredienteReceta);
    }

    @Transactional
    public IngredienteReceta update(Integer id, IngredienteReceta ingredienteReceta) {
        IngredienteReceta existing = findById(id);
        existing.setCantidad(ingredienteReceta.getCantidad());
        existing.setUnidadMedida(ingredienteReceta.getUnidadMedida());
        return ingredienteRecetaRepository.save(existing);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!ingredienteRecetaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ingrediente de receta no encontrado: " + id);
        }
        ingredienteRecetaRepository.deleteById(id);
    }
}
