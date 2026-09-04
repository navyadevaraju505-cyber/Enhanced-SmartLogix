package com.smartlogix.logisticsoptimizer.service;

import com.smartlogix.logisticsoptimizer.model.DeliveryOrder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DeliveryPlanningService {

    /*
     * Dynamic Programming approach:
     * Selects a combination of deliveries that gives
     * the maximum total priority value without exceeding
     * the vehicle's maximum distance capacity.
     *
     * HIGH   = 3 points
     * MEDIUM = 2 points
     * LOW    = 1 point
     */
    public List<DeliveryOrder> optimizeDeliveryPlan(
            List<DeliveryOrder> deliveries,
            int maxDistance) {

        int n = deliveries.size();

        int[][] dp = new int[n + 1][maxDistance + 1];

        for (int i = 1; i <= n; i++) {

            DeliveryOrder delivery = deliveries.get(i - 1);

            int distance = (int) delivery.getDistanceKm();
            int value = getPriorityValue(delivery.getPriority());

            for (int capacity = 0; capacity <= maxDistance; capacity++) {

                dp[i][capacity] = dp[i - 1][capacity];

                if (distance <= capacity) {

                    dp[i][capacity] = Math.max(
                            dp[i][capacity],
                            dp[i - 1][capacity - distance] + value
                    );
                }
            }
        }

        // Reconstruct the selected deliveries
        List<DeliveryOrder> selectedDeliveries = new ArrayList<>();

        int capacity = maxDistance;

        for (int i = n; i > 0; i--) {

            if (dp[i][capacity] != dp[i - 1][capacity]) {

                DeliveryOrder delivery = deliveries.get(i - 1);

                selectedDeliveries.add(delivery);

                capacity -= (int) delivery.getDistanceKm();
            }
        }

        return selectedDeliveries;
    }

    private int getPriorityValue(String priority) {

        if (priority == null) {
            return 1;
        }

        return switch (priority.toUpperCase()) {
            case "HIGH" -> 3;
            case "MEDIUM" -> 2;
            case "LOW" -> 1;
            default -> 1;
        };
    }
}