package com.YessGelatinas.sistema_yess.controller;

import com.YessGelatinas.sistema_yess.model.Direccion;
import com.YessGelatinas.sistema_yess.service.DireccionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/direcciones")
public class DireccionController {

    private final DireccionService direccionService;

    public DireccionController(DireccionService direccionService) {
        this.direccionService = direccionService;
    }

    @PostMapping
    public ResponseEntity<Direccion> create(@RequestBody Direccion direccion) {
        return ResponseEntity.status(HttpStatus.CREATED).body(direccionService.save(direccion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Direccion> update(@PathVariable Integer id, @RequestBody Direccion direccion) {
        return ResponseEntity.ok(direccionService.update(id, direccion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        direccionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
