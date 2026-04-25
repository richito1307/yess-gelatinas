package com.YessGelatinas.sistema_yess.service;

import com.YessGelatinas.sistema_yess.exception.ResourceNotFoundException;
import com.YessGelatinas.sistema_yess.model.Cliente;
import com.YessGelatinas.sistema_yess.model.Direccion;
import com.YessGelatinas.sistema_yess.repository.ClienteRepository;
import com.YessGelatinas.sistema_yess.repository.DireccionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DireccionService {

    private final DireccionRepository direccionRepository;
    private final ClienteRepository clienteRepository;

    public DireccionService(DireccionRepository direccionRepository, ClienteRepository clienteRepository) {
        this.direccionRepository = direccionRepository;
        this.clienteRepository = clienteRepository;
    }

    public List<Direccion> findByClienteId(Integer clienteId) {
        return direccionRepository.findByClienteId(clienteId);
    }

    public Direccion findById(Integer id) {
        return direccionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada: " + id));
    }

    @Transactional
    public Direccion save(Direccion direccion) {
        if (direccion.getCliente() != null && direccion.getCliente().getId() != null) {
            Cliente cliente = clienteRepository.findById(direccion.getCliente().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
            direccion.setCliente(cliente);
        }
        return direccionRepository.save(direccion);
    }

    @Transactional
    public Direccion update(Integer id, Direccion datos) {
        Direccion existing = findById(id);
        existing.setAlias(datos.getAlias());
        existing.setCalle(datos.getCalle());
        existing.setColonia(datos.getColonia());
        existing.setCiudad(datos.getCiudad());
        existing.setEstado(datos.getEstado());
        existing.setCodigoPostal(datos.getCodigoPostal());
        existing.setReferencias(datos.getReferencias());
        existing.setEsPrincipal(datos.getEsPrincipal());
        return direccionRepository.save(existing);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!direccionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Dirección no encontrada: " + id);
        }
        direccionRepository.deleteById(id);
    }
}
