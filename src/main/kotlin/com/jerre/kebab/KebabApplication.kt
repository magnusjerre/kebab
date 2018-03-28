package com.jerre.kebab

import com.jerre.kebab.models.User
import com.jerre.kebab.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.csrf.CsrfFilter
import org.springframework.web.bind.annotation.*
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
        //registry.addViewController("/login").setViewName("loginfile")
        registry.addViewController("/index").setViewName("index")
    }
}

@Configuration
@EnableWebSecurity
class WebSecurityConfig(disableDefaults: Boolean = false) : WebSecurityConfigurerAdapter(disableDefaults) {
    @Autowired lateinit var userDetailsService: UserDetailsService

    override fun configure(http: HttpSecurity?) {
        http!!
                .authorizeRequests()
                //Spring boot forventer at alt etter /static/ er root -> sample.js blir localhost:8080/js/sample.js
                    .antMatchers("/", "/home", "/index", "/js/**", "/api/open/**").permitAll()
                    .anyRequest().authenticated()
                .and()
                .formLogin()
                    .successHandler(MyAuthenticationSuccessHandler())
                    .failureHandler(MyAuthenticationFailureHandler())
                .and()
                .exceptionHandling()
                    .authenticationEntryPoint(MyAuthenticationEntryPoint())
                .and()
                .logout()
                    .logoutSuccessHandler(MyLogoutSuccessHandler())
                    .permitAll()
                .and().addFilterAfter(CsrfTokenResponseHeaderBindingFilter(), CsrfFilter::class.java)
    }

    @Throws(Exception::class)
    @Autowired
    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordencoder())
    }

    @Bean
    override fun authenticationManagerBean(): AuthenticationManager {
        return super.authenticationManagerBean()
    }

    @Bean
    fun bCryptPasswordencoder() = BCryptPasswordEncoder()

}

@RestController
@RequestMapping("api/open")
class JallaOpenController {
    @Autowired lateinit var securityService: UserService
    @GetMapping("names")
    fun names() = listOf("Magnus", "Sofia")

    @PostMapping("user", consumes = arrayOf("application/json"), produces = arrayOf("application/json"))
    fun newUser(@RequestBody user: User) = securityService.save(user)
}

@RestController
@RequestMapping("api/closed")
class JallaClosedController {
    @GetMapping("surnames")
    fun surnames() = listOf("Jerre", "Bakke")
}