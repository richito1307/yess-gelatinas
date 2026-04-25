package com.YessGelatinas.sistema_yess.service;

import com.YessGelatinas.sistema_yess.exception.ResourceNotFoundException;
import com.YessGelatinas.sistema_yess.model.Cliente;
import com.YessGelatinas.sistema_yess.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> findAll() {
        return clienteRepository.findByActivoTrue();
    }

    public List<Cliente> search(String nombre) {
        return clienteRepository.findByNombreContainingIgnoreCaseAndActivoTrue(nombre);
    }

    public Cliente findById(Integer id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado: " + id));
    }

    @Transactional
    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Transactional
    public Cliente update(Integer id, Cliente datos) {
        Cliente existing = findById(id);
        existing.setNombre(datos.getNombre());
        existing.setTelefono(datos.getTelefono());
        existing.setEmail(datos.getEmail());
        existing.setNotas(datos.getNotas());
        return clienteRepository.save(existing);
    }

    @Transactional
    public void deleteById(Integer id) {
        Cliente cliente = findById(id);
        cliente.setActivo(false);
        clienteRepository.save(cliente);
    }
}
