package com.YessGelatinas.sistema_yess.controller;

import com.YessGelatinas.sistema_yess.model.Cliente;
import com.YessGelatinas.sistema_yess.model.Direccion;
import com.YessGelatinas.sistema_yess.service.ClienteService;
import com.YessGelatinas.sistema_yess.service.DireccionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final DireccionService direccionService;

    public ClienteController(ClienteService clienteService, DireccionService direccionService) {
        this.clienteService = clienteService;
        this.direccionService = direccionService;
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> getAll() {
        return ResponseEntity.ok(clienteService.findAll());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Cliente>> search(@RequestParam String nombre) {
        return ResponseEntity.ok(clienteService.search(nombre));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(clienteService.findById(id));
    }

    @GetMapping("/{id}/direcciones")
    public ResponseEntity<List<Direccion>> getDirecciones(@PathVariable Integer id) {
        return ResponseEntity.ok(direccionService.findByClienteId(id));
    }

    @PostMapping
    public ResponseEntity<Cliente> create(@RequestBody Cliente cliente) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.save(cliente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> update(@PathVariable Integer id, @RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.update(id, cliente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        clienteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
