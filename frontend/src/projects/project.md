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
  title: "{{ project.name }}{%- if project.alternateName %} <small>{{ project.alternateName }}</small>{% endif -%}"
  dissolutionDate: "{% if project.dissolutionDate %}{{ project.dissolutionDate }}{% else %}1970{% endif %}"
  feature:
    image: "{% if project.image %}{{ project.image }}{% else %}https://placeimg.com/640/480/tech/grayscale{% endif %}"
    description: "random technology image from placeimg.com, should be replaced with a placeholder"
---
