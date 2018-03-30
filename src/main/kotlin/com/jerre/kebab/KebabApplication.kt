package com.jerre.kebab

import com.jerre.kebab.models.*
import com.jerre.kebab.services.DishService
import com.jerre.kebab.services.PurchaseService
import com.jerre.kebab.services.ShopService
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
        registry.addViewController("/").setViewName("index")
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
    @Autowired lateinit var shopService: ShopService
    @Autowired lateinit var dishService: DishService

    @GetMapping("names")
    fun names() = listOf("Magnus", "Sofia")

    @PostMapping("user", consumes = arrayOf("application/json"), produces = arrayOf("application/json"))
    fun newUser(@RequestBody user: User) {
        securityService.save(user)
    }

    @GetMapping("nyShop")
    fun nyShop() = shopService.save(Shop(name = "New Beirut", address = "Torggata"))

    @GetMapping("nyDish")
    fun nyDish() = dishService.save(Dish(name = "Kebab",
            priceSizes = arrayOf(
                    PriceSize(55, Size(SizeEnum.SMALL, "Liten")),
                    PriceSize(60, Size(SizeEnum.MEDIUM, "Vanlig")),
                    PriceSize(75, Size(SizeEnum.LARGE, "King kong"))
            ),
            shopId = "jfjf",
            vegetarian = false))

    @GetMapping("shop")
    fun shop() = shopService.findAll()

    @GetMapping("dish")
    fun dish() = dishService.findAll()

    @GetMapping("shop/{shopId}/dish")
    fun getDishesForShop(@PathVariable shopId: String) = dishService.findDishesForShop(shopId)

    @PostMapping("shop")
    fun insertShop(@RequestBody shop: Shop) = shopService.save(shop)
}

@RestController
@RequestMapping("api/closed")
class JallaClosedController {
    @Autowired lateinit var shopService: ShopService
    @Autowired lateinit var dishService: DishService
    @Autowired lateinit var purchaseService: PurchaseService

    @GetMapping("surnames")
    fun surnames() = listOf("Jerre", "Bakke")

    @PostMapping("shop")
    fun insertShop(@RequestBody shop: Shop) = shopService.save(shop)

    @PostMapping("dish")
    fun insertDish(@RequestBody dish: Dish) = dishService.save(dish)

    @PostMapping("purchase")
    fun insertDish(@RequestBody purchasePost: PurchasePost) = purchaseService.save(purchasePost)

    @GetMapping("purchase")
    fun getPurchasesForLoggedInUser() = purchaseService.findAllForLoggedInUser()
}