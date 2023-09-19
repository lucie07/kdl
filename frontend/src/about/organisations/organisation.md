---
breadcrumb: "Partners and funders"
layout: layouts/organisation.njk
pagination:
  data: organisations
  size: 1
  alias: agentInstance
permalink: "about/partners-and-funders/{{ agentInstance.agent.slug }}/"
eleventyComputed:
  navKey: "Partners and funders"
  title: "{% include 'partials/organisation.njk' %}"
---
