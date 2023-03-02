---
layout: layouts/project.njk
pagination:
  data: projects
  size: 1
  alias: project
  addAllPagesToCollections: true
permalink: "projects/{{ project.slug }}/"
tags: projects
eleventyComputed:
  navKey: "Projects"
  title: "{%- if project.alternateName %} <small>{{ project.alternateName }}</small>{% endif -%}{{ project.name }}"
  dissolutionDate: "{% if project.dissolutionDate %}{{ project.dissolutionDate }}{% else %}1970{% endif %}"
  feature:
    image: "{% if project.image.id %}{% getDirectusAsset project.image.id %}{% else %}{{ project.image.path }}{% endif %}"
    description: "{{ project.image.description }}"
---
