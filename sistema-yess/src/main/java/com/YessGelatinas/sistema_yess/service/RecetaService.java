package com.YessGelatinas.sistema_yess.service;

import com.YessGelatinas.sistema_yess.exception.ResourceNotFoundException;
import com.YessGelatinas.sistema_yess.model.Receta;
import com.YessGelatinas.sistema_yess.repository.RecetaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecetaService {

    private final RecetaRepository recetaRepository;

    public RecetaService(RecetaRepository recetaRepository) {
        this.recetaRepository = recetaRepository;
    }

    public List<Receta> findAll() {
        return recetaRepository.findAll();
    }

    public Receta findById(Integer id) {
        return recetaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receta no encontrada: " + id));
    }

    @Transactional
    public Receta save(Receta receta) {
        return recetaRepository.save(receta);
    }

    @Transactional
    public Receta update(Integer id, Receta receta) {
        Receta existing = findById(id);
        existing.setNombrePostre(receta.getNombrePostre());
        existing.setDescripcion(receta.getDescripcion());
        existing.setPrecio(receta.getPrecio());
        return recetaRepository.save(existing);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!recetaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Receta no encontrada: " + id);
        }
        recetaRepository.deleteById(id);
    }
}
