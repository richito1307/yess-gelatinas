package com.YessGelatinas.sistema_yess.controller;

import com.YessGelatinas.sistema_yess.model.IngredienteReceta;
import com.YessGelatinas.sistema_yess.service.IngredienteRecetaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredientes-receta")
public class IngredienteRecetaController {

    private final IngredienteRecetaService ingredienteRecetaService;

    public IngredienteRecetaController(IngredienteRecetaService ingredienteRecetaService) {
        this.ingredienteRecetaService = ingredienteRecetaService;
    }

    @PostMapping
    public ResponseEntity<IngredienteReceta> create(@RequestBody IngredienteReceta ingredienteReceta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ingredienteRecetaService.save(ingredienteReceta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngredienteReceta> update(@PathVariable Integer id,
                                                    @RequestBody IngredienteReceta ingredienteReceta) {
        return ResponseEntity.ok(ingredienteRecetaService.update(id, ingredienteReceta));
    }

    @GetMapping
    public ResponseEntity<List<IngredienteReceta>> getAll() {
        return ResponseEntity.ok(ingredienteRecetaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredienteReceta> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ingredienteRecetaService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        ingredienteRecetaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
