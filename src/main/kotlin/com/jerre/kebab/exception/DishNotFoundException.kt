package com.jerre.kebab.exception

class DishNotFoundException(id: String) : RuntimeException("Couldn't find dish with id ${id}")