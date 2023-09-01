---
breadcrumb: Organisations
layout: layouts/organisation.njk
pagination:
  data: organisations
  size: 1
  alias: agentInstance
permalink: "about/partners-and-funders/{{ agentInstance.agent.slug }}/"
eleventyComputed:
  navKey: "People"
  title: "{{ agentInstance.agent.name }}{%-if agentInstance.agent.alternateName %} <span>{{ agentInstance.agent.alternateName }}</span>{% endif %}"
---
