package com.smartlogix.logisticsoptimizer.controller;

import com.smartlogix.logisticsoptimizer.model.DeliveryOrder;
import com.smartlogix.logisticsoptimizer.repository.DeliveryOrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryOrderController {

    private final DeliveryOrderRepository repository;

    public DeliveryOrderController(DeliveryOrderRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<DeliveryOrder> getAllDeliveries() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public DeliveryOrder getDeliveryById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
    }

    @PostMapping
    public DeliveryOrder createDelivery(@RequestBody DeliveryOrder deliveryOrder) {
        return repository.save(deliveryOrder);
    }

    @PutMapping("/{id}")
    public DeliveryOrder updateDelivery(
            @PathVariable Long id,
            @RequestBody DeliveryOrder updatedDelivery) {

        DeliveryOrder existingDelivery = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        existingDelivery.setCustomerName(updatedDelivery.getCustomerName());
        existingDelivery.setPickupLocation(updatedDelivery.getPickupLocation());
        existingDelivery.setDeliveryLocation(updatedDelivery.getDeliveryLocation());
        existingDelivery.setPriority(updatedDelivery.getPriority());
        existingDelivery.setDistanceKm(updatedDelivery.getDistanceKm());
        existingDelivery.setStatus(updatedDelivery.getStatus());

        return repository.save(existingDelivery);
    }

    @DeleteMapping("/{id}")
    public void deleteDelivery(@PathVariable Long id) {
        repository.deleteById(id);
    }
}