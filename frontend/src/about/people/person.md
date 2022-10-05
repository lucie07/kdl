---
breadcrumb: People
layout: layouts/person.njk
pagination:
  data: people
  size: 1
  alias: agentInstance
permalink: "about/people/{{ agentInstance.agent.slug }}/"
eleventyComputed:
  navKey: "People"
  title: "{{ agentInstance.agent.name }}{%-if agentInstance.agent.alternateName %} <span>{{ agentInstance.agent.alternateName }}</span>{% endif %}"
---
