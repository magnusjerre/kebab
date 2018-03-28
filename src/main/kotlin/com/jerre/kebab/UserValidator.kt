package com.jerre.kebab

import com.jerre.kebab.models.User
import com.jerre.kebab.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.validation.Errors
import org.springframework.validation.ValidationUtils
import org.springframework.validation.Validator
import java.util.regex.Pattern

@Component
class UserValidator : Validator {
    @Autowired lateinit var userSerivce: UserService

    override fun validate(target: Any?, errors: Errors) {
        val user = target as User

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "NotEmpty")
        if (!Pattern.matches("\\w{4,10}", user.username)) {
            errors.rejectValue("username", "Size.userForm.username")    //uvisst hvor errorcode navngiving kommer fra
        }
        if (userSerivce.findByUsername(user.username ?: "user") != null) {
            errors.rejectValue("username", "Duplicate.userForm.username")
        }

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "NotEmpty")
    }

    override fun supports(clazz: Class<*>): Boolean {
        return User::class.java.equals(clazz)
    }
}