package com.YessGelatinas.sistema_yess.controller;

import com.YessGelatinas.sistema_yess.model.UnidadMedida;
import com.YessGelatinas.sistema_yess.service.UnidadMedidaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unidades-medida")
public class UnidadMedidaController {

    private final UnidadMedidaService unidadMedidaService;

    public UnidadMedidaController(UnidadMedidaService unidadMedidaService) {
        this.unidadMedidaService = unidadMedidaService;
    }

    @PostMapping
    public ResponseEntity<UnidadMedida> create(@RequestBody UnidadMedida unidadMedida) {
        return ResponseEntity.status(HttpStatus.CREATED).body(unidadMedidaService.save(unidadMedida));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnidadMedida> update(@PathVariable Integer id, @RequestBody UnidadMedida unidadMedida) {
        return ResponseEntity.ok(unidadMedidaService.update(id, unidadMedida));
    }

    @GetMapping
    public ResponseEntity<List<UnidadMedida>> getAll() {
        return ResponseEntity.ok(unidadMedidaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnidadMedida> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(unidadMedidaService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        unidadMedidaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
