package com.jerre.kebab

import org.springframework.http.MediaType
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler
import org.springframework.security.web.csrf.CsrfToken
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class MyAuthenticationSuccessHandler : SimpleUrlAuthenticationSuccessHandler() {
    override fun onAuthenticationSuccess(request: HttpServletRequest?, response: HttpServletResponse?, authentication: Authentication?) {
        response?.status = HttpServletResponse.SC_OK
        response?.contentType = MediaType.APPLICATION_JSON_VALUE

        response?.outputStream?.print("{\"name\":\"Magga\"}")
        clearAuthenticationAttributes(request)
    }
}

//Mulig denne ikke trengs å overrides?
class MyAuthenticationFailureHandler : SimpleUrlAuthenticationFailureHandler() {
    override fun onAuthenticationFailure(request: HttpServletRequest?, response: HttpServletResponse?, exception: AuthenticationException?) {
        response?.status = HttpServletResponse.SC_UNAUTHORIZED
        response?.contentType = MediaType.APPLICATION_JSON_VALUE
        response?.outputStream?.print("{\"message\":\"You failed this test...\"}")
    }
}

class MyLogoutSuccessHandler : LogoutSuccessHandler {
    override fun onLogoutSuccess(request: HttpServletRequest?, response: HttpServletResponse?, authentication: Authentication?) {
        response?.status = HttpServletResponse.SC_OK
    }
}


/**
 * Based on this repo: https://github.com/codesandnotes/restsecurity
 * Instead of redirecting to the login-page, this returns a 401 instead
 */
class MyAuthenticationEntryPoint : AuthenticationEntryPoint {
    override fun commence(request: HttpServletRequest?, response: HttpServletResponse?, authException: AuthenticationException?) {
        response?.sendError(HttpServletResponse.SC_UNAUTHORIZED)
    }
}

/**
 * Based on this repo: https://github.com/aditzel/spring-security-csrf-filter
 * and this article: http://www.codesandnotes.be/2015/02/05/spring-securitys-csrf-protection-for-rest-services-the-client-side-and-the-server-side/
 */
class CsrfTokenResponseHeaderBindingFilter : OncePerRequestFilter() {
    val REQUEST_ATTRIBUTE_NAME = "_csrf"
    val RESPONSE_HEADER_NAME = "X-CSRF-HEADER"
    val RESPONSE_PARM_NAME = "X-CSRF-PARAM"
    val RESPONSE_TOKEN_NAME = "X-CSRF-TOKEN"

    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {
        val token : CsrfToken? = request.getAttribute(REQUEST_ATTRIBUTE_NAME) as CsrfToken

        if (token != null) {
            response.setHeader(RESPONSE_HEADER_NAME, token.headerName)
            response.setHeader(RESPONSE_PARM_NAME, token.parameterName)
            response.setHeader(RESPONSE_TOKEN_NAME, token.token)
        }

        filterChain.doFilter(request, response)
    }
}