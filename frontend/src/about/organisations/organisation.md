---
breadcrumb: "Partners and funders"
layout: layouts/organisation.njk
pagination:
  data: organisations
  size: 1
  alias: agentInstance
  addAllPagesToCollections: true
permalink: "about/partners-and-funders/{{ agentInstance.agent.slug }}/"
tags: organisations
eleventyComputed:
  navKey: "Partners and funders"
  index: "{{ agentInstance.agent.name[0] | downcase }}"
  title: "{% include 'partials/organisation.njk' %}"
---
