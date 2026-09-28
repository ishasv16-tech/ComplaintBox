package com.complaintbox.controller;
import com.complaintbox.repository.CategoryRepository; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/categories") public class CategoryController { private final CategoryRepository repo; public CategoryController(CategoryRepository r){repo=r;} @GetMapping public List<?> all(){return repo.findAll();} }
