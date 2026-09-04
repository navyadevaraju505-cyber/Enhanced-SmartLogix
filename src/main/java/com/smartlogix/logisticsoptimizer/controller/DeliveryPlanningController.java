package com.smartlogix.logisticsoptimizer.controller;

import com.smartlogix.logisticsoptimizer.model.DeliveryOrder;
import com.smartlogix.logisticsoptimizer.repository.DeliveryOrderRepository;
import com.smartlogix.logisticsoptimizer.service.DeliveryPlanningService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/optimization")
@CrossOrigin(origins = "*")
public class DeliveryPlanningController {

    private final DeliveryOrderRepository repository;
    private final DeliveryPlanningService planningService;

    public DeliveryPlanningController(
            DeliveryOrderRepository repository,
            DeliveryPlanningService planningService) {
        this.repository = repository;
        this.planningService = planningService;
    }

    @GetMapping("/delivery-plan")
    public List<DeliveryOrder> optimizeDeliveryPlan(
            @RequestParam(defaultValue = "1500") int maxDistance) {

        List<DeliveryOrder> deliveries = repository.findAll();

        return planningService.optimizeDeliveryPlan(
                deliveries,
                maxDistance
        );
    }
}