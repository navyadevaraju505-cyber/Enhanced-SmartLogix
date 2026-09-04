package com.smartlogix.logisticsoptimizer.repository;

import com.smartlogix.logisticsoptimizer.model.DeliveryOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryOrderRepository extends JpaRepository<DeliveryOrder, Long> {
}