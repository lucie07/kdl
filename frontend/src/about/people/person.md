---
breadcrumb: People
layout: layouts/person.njk
pagination:
  data: people
  size: 1
  alias: agentInstance
  addAllPagesToCollections: true
permalink: "about/people/{{ agentInstance.agent.slug }}/"
tags: people
eleventyComputed:
  navKey: "People"
  id: "{{ agentInstance.agent.name }}"
  name: "{{ agentInstance.agent.name }}"
  title: "{{ agentInstance.agent.name }}{%-if agentInstance.agent.alternateName %} <span>{{ agentInstance.agent.alternateName }}</span>{% endif %}"
---
