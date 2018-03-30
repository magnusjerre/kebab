package com.jerre.kebab.services

import com.jerre.kebab.repositories.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl : UserDetailsService {
    @Autowired
    lateinit var userRepo : UserRepository

    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(username: String?): UserDetails {
        val user = userRepo.findByUsername(username ?: "")
        return org.springframework.security.core.userdetails.User(user?.username, user?.password, listOf(SimpleGrantedAuthority("normal")))
    }
}