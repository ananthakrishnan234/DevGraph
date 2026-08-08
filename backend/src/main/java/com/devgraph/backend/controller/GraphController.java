package com.devgraph.backend.controller;

import com.devgraph.backend.service.GraphService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class GraphController {

    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @GetMapping("/developers")
    public List<Map<String, Object>> getDevelopers() {
        return graphService.getDevelopers();
    }

    @GetMapping("/developers/{id}")
    public Map<String, Object> getDeveloper(
            @PathVariable String id
    ) {
        return graphService.getDeveloper(id);
    }

    @GetMapping("/skills")
    public List<String> getSkills() {
        return graphService.getSkills();
    }

    @GetMapping("/skills/path")
    public List<Map<String, Object>> getSkillPath(
            @RequestParam String from,
            @RequestParam String to
    ) {
        return graphService.findSkillPath(from, to);
    }
}