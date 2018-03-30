package com.jerre.kebab.services

import com.jerre.kebab.exception.DishNotFoundException
import com.jerre.kebab.models.Purchase
import com.jerre.kebab.models.PurchasePost
import com.jerre.kebab.repositories.PurchaseRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class PurchaseService {
    @Autowired lateinit var securityService: SecurityService
    @Autowired lateinit var dishService: DishService
    @Autowired lateinit var purchaseRepository: PurchaseRepository

    fun save(purchasePost: PurchasePost) : Purchase {
        val userId = securityService.findLoggedInUserID() ?: throw UsernameNotFoundException("Ugyldig brukernavn")
        dishService.findById(purchasePost.dishId) ?: throw DishNotFoundException(purchasePost.dishId)
        val purchase = Purchase(
                dishId = purchasePost.dishId,
                userId = userId,
                dateTime = LocalDateTime.now(),
                purchaseInfo = purchasePost.purchaseInfo,
                ratingInfo = purchasePost.ratingInfo
        )

        return purchaseRepository.save(purchase)
    }

    fun findAll() = purchaseRepository.findAll()


    fun findAllForLoggedInUser() : List<Purchase> {
        val userId = securityService.findLoggedInUserID() ?: throw UsernameNotFoundException("Ugyldig brukernavn")
        return purchaseRepository.findAllByUserId(userId)
    }
}