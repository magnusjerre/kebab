package com.jerre.kebab.repositories

import com.jerre.kebab.models.Shop
import org.springframework.data.mongodb.repository.MongoRepository

interface ShopRepository : MongoRepository<Shop, String>