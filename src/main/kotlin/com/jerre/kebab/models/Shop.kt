package com.jerre.kebab.models

import org.springframework.data.annotation.Id

data class Shop(
        @Id var id: String? = null,
        var name: String,
        var address: String
)