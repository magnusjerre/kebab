package com.jerre.kebab.services

import com.jerre.kebab.models.Dish
import com.jerre.kebab.repositories.DishRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DishService {
    @Autowired lateinit var dishRepository: DishRepository
    @Autowired lateinit var shopService: ShopService

    fun save(dish: Dish) : Dish {
        if (dish.priceSizes.isEmpty()) throw IllegalArgumentException("Mangler verdier for priceSizes")
        if (!shopService.findShopById(dish.shopId).isPresent()) throw IllegalArgumentException("Ugylding butikk")
        return dishRepository.save(dish)
    }

    fun findById(id: String) = dishRepository.findById(id)

    fun findAll() = dishRepository.findAll()

    fun findDishesForShop(shopId: String) = dishRepository.findByShopId(shopId)
}