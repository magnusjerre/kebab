package com.jerre.kebab

import com.jerre.kebab.models.User
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Repository

@Repository
class UserRepository {
    val users: ArrayList<User> = ArrayList()
    var idCounter: Int = 10
    init {
        users.add(User("default", "user", BCryptPasswordEncoder().encode("password")))
    }

    fun findByUsername(username: String) = users.find { username == it.username }
    fun save(user: User) : User {
        user._id = idCounter++.toString()
        users.add(user)
        return user
    }
}