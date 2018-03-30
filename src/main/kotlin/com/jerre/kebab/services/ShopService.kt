package com.jerre.kebab.services

import com.jerre.kebab.models.Shop
import com.jerre.kebab.repositories.ShopRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ShopService {
    @Autowired lateinit var shopRepository: ShopRepository

    fun save(shop: Shop) = shopRepository.save(shop)

    fun findShopById(id: String) = shopRepository.findById(id)

    fun findAll() = shopRepository.findAll()
}