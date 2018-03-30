package com.jerre.kebab.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.User
import org.springframework.stereotype.Service

@Service
class SecurityService {
    @Autowired lateinit var userService: UserService

    fun findLoggedInUserID() : String? {
        val principal = SecurityContextHolder.getContext().authentication.principal
        if (principal is User) {
            val user = userService.findByUsername(principal.username)
            return user?.id
        }
        return null
    }
}