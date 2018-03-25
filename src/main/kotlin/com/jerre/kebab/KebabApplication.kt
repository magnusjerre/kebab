package com.jerre.kebab

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@SpringBootApplication
class KebabApplication

fun main(args: Array<String>) {
    runApplication<KebabApplication>(*args)
}

//TODO: Les opp om mvc konfigurering / view resolving
@Configuration
class MvcConfig : WebMvcConfigurer {
    override fun addViewControllers(registry: ViewControllerRegistry) {
        registry.addViewController("/home").setViewName("home")
        registry.addViewController("/").setViewName("home")
        registry.addViewController("/hello").setViewName("hello")
        registry.addViewController("/login").setViewName("loginfile")
    }
}

@Configuration
@EnableWebSecurity
class WebSecurityConfig(disableDefaults: Boolean = false) : WebSecurityConfigurerAdapter(disableDefaults) {
    override fun configure(http: HttpSecurity?) {
        http!!
                .authorizeRequests()
                //Spring boot forventer at alt etter /static/ er root -> sample.js blir localhost:8080/js/sample.js
                    .antMatchers("/", "/home", "/js/**", "/api/open/**").permitAll()
                    .anyRequest().authenticated()
                .and()
                .formLogin()
                    .loginPage("/login").permitAll()
                .and()
                .logout()
                    .permitAll()
    }

    @Bean
    override fun userDetailsService(): UserDetailsService {
        val user = User.withDefaultPasswordEncoder().username("user").password("password").roles("USER").build()
        return InMemoryUserDetailsManager(user)
    }
}

@RestController
@RequestMapping("api/open")
class JallaOpenController {
    @GetMapping("names")
    fun names() = listOf("Magnus", "Sofia")
}

@RestController
@RequestMapping("api/closed")
class JallaClosedController {
    @GetMapping("surnames")
    fun surnames() = listOf("Jerre", "Bakke")
}