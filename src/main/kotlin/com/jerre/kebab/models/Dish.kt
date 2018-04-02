package com.jerre.kebab.models

import org.springframework.data.annotation.Id

data class Dish(
        @Id var id: String? = null,
        var name: String,
        var priceSizes: Array<PriceSize>,
        var shopId: String,
        var vegetarian: Boolean
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Dish

        if (id != other.id) return false
        return true
    }

    override fun hashCode(): Int {
        return id?.hashCode() ?: 0
    }
}

data class PriceSize(val price: Int, val size: Size)

data class Size(val size: SizeEnum, val name: String)

enum class SizeEnum {
    XSMALL, SMALL, MEDIUM, LARGE, XLARGE, SINGLE_SIZE
}
