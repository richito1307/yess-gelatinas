package com.YessGelatinas.sistema_yess.controller;

import com.YessGelatinas.sistema_yess.model.Receta;
import com.YessGelatinas.sistema_yess.service.RecetaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recetas")
public class RecetaController {

    private final RecetaService recetaService;

    public RecetaController(RecetaService recetaService) {
        this.recetaService = recetaService;
    }

    @PostMapping
    public ResponseEntity<Receta> create(@RequestBody Receta receta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recetaService.save(receta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receta> update(@PathVariable Integer id, @RequestBody Receta receta) {
        return ResponseEntity.ok(recetaService.update(id, receta));
    }

    @GetMapping
    public ResponseEntity<List<Receta>> getAll() {
        return ResponseEntity.ok(recetaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receta> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(recetaService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        recetaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
