package com.jerre.kebab.services

import com.jerre.kebab.UserRepository
import com.jerre.kebab.models.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService {
    @Autowired lateinit var userRepository: UserRepository
    @Autowired lateinit var passwordEncoder: BCryptPasswordEncoder

    fun save(user: User) : User {
        user.password = passwordEncoder.encode(user.password)
        return userRepository.save(user)
    }

    fun findByUsername(username: String) = userRepository.findByUsername(username)
}