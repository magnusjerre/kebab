package com.jerre.kebab.repositories

import com.jerre.kebab.models.Purchase
import org.springframework.data.mongodb.repository.MongoRepository

interface PurchaseRepository : MongoRepository<Purchase, String> {
    fun findAllByUserId(id: String) : List<Purchase>
}