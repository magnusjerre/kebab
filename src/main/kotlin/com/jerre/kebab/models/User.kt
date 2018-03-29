package com.jerre.kebab.models

import org.springframework.data.annotation.Id

data class User(@Id var id: String? = null, var username: String? = null, var email: String? = null, var password: String? = null) {
    override fun toString() = "User(username=\"${username}\", email=${email}, id=${id})"
}