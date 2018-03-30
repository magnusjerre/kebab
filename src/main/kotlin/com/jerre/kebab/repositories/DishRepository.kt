package com.jerre.kebab.repositories

import com.jerre.kebab.models.Dish
import org.springframework.data.mongodb.repository.MongoRepository

interface DishRepository : MongoRepository<Dish, String> {
    fun findByShopId(shopId: String) : List<Dish>
}
