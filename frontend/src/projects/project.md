---
layout: layouts/project.njk
pagination:
  data: projects
  size: 1
  alias: project
permalink: "projects/{{ project.slug }}/"
eleventyComputed:
  navKey: "Projects"
  title: "{{ project.name }}{%- if project.alternateName %} <span>{{ project.alternateName }}</span>{% endif -%}"
---
