package com.YessGelatinas.sistema_yess.service;

import com.YessGelatinas.sistema_yess.exception.ResourceNotFoundException;
import com.YessGelatinas.sistema_yess.model.Venta;
import com.YessGelatinas.sistema_yess.repository.ClienteRepository;
import com.YessGelatinas.sistema_yess.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;

    public VentaService(VentaRepository ventaRepository, ClienteRepository clienteRepository) {
        this.ventaRepository = ventaRepository;
        this.clienteRepository = clienteRepository;
    }

    public List<Venta> findAll() {
        return ventaRepository.findAll();
    }

    public Venta findById(Integer id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada: " + id));
    }

    @Transactional
    public Venta save(Venta venta) {
        if (venta.getCliente() != null && venta.getCliente().getId() != null) {
            venta.setCliente(clienteRepository.findById(venta.getCliente().getId()).orElse(null));
        }
        return ventaRepository.save(venta);
    }

    @Transactional
    public Venta update(Integer id, Venta venta) {
        Venta existing = findById(id);
        existing.setTotal(venta.getTotal());
        return ventaRepository.save(existing);
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!ventaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Venta no encontrada: " + id);
        }
        ventaRepository.deleteById(id);
    }
}
