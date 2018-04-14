package com.jerre.kebab

import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest
@TestPropertySource(locations = arrayOf("classpath:test.properties"))
class KebabApplicationTests {

	@Test
	fun contextLoads() {
	}

}
