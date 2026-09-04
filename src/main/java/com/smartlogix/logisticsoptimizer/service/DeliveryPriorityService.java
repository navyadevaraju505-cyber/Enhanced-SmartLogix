package com.smartlogix.logisticsoptimizer.service;

import com.smartlogix.logisticsoptimizer.model.DeliveryOrder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

@Service
public class DeliveryPriorityService {

    private int getPriorityValue(String priority) {
        if (priority == null) {
            return 3;
        }

        return switch (priority.toUpperCase()) {
            case "HIGH" -> 1;
            case "MEDIUM" -> 2;
            case "LOW" -> 3;
            default -> 3;
        };
    }

    public List<DeliveryOrder> prioritizeDeliveries(
            List<DeliveryOrder> deliveries) {

        PriorityQueue<DeliveryOrder> queue =
                new PriorityQueue<>(
                        Comparator.comparingInt(
                                delivery -> getPriorityValue(
                                        delivery.getPriority()
                                )
                        )
                );

        queue.addAll(deliveries);

        List<DeliveryOrder> result = new java.util.ArrayList<>();

        while (!queue.isEmpty()) {
            result.add(queue.poll());
        }

        return result;
    }
}