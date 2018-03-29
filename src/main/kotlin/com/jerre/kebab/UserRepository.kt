package com.jerre.kebab

import com.jerre.kebab.models.User
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : MongoRepository<User, String> {
    fun findByUsername(username: String) : User?
}