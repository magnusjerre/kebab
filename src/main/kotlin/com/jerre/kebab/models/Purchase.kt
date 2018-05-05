package com.jerre.kebab.models

import org.springframework.data.annotation.Id
import java.time.LocalDateTime

data class Purchase(
        @Id var id: String? = null,
        val dishId: String,
        val userId: String,
        val dateTime: LocalDateTime,
        val purchaseInfo: PurchaseInfo,
        val ratingInfo: RatingInfo
)

data class PurchaseInfo(val price: Int, val size: SizeEnum, val strength: StrengthEnum)

data class RatingInfo(val rating: Grade, val strength: StrengthEnum, val deliveryTime: DeliveryTime, val comment: String)

data class Grade(val value: Int, val max: Int)

enum class DeliveryTime {
    SLOW, OK, FAST
}

enum class StrengthEnum {
    MILD, MEDIUM, HOT, INTENSE
}

class PurchasePost(
        val dishId: String,
        val purchaseInfo: PurchaseInfo,
        val ratingInfo: RatingInfo)
