---
title: What kind of infrastructure does KDL use?
tags:
  - faq
  - pre-project
---

We have our own VMWare based infrastructure for hosting projects, but that may change in the future. Each project has at most 3 instances, dev (for development), staging and live. Each project has by default 3 instances, dev (for development), staging and live. We currently use [Docker](https://github.com/kingsdigitallab/cookiecutter-django) for local development and deployment.

We use mostly [GitHub](https://github.com/kingsdigitallab/) for source control, but we also have some projects in Gitlab, when we need more control over the CI pipeline or for private repositories. For continuous integration we use both Travis and [Gitlab](https://gitlab.com/kingsdigitallab) CI. The projects are deployed manually using a [Fabric](http://www.fabfile.org/) script.

We make use of a [startup configuration to start new projects](https://github.com/kingsdigitallab/cookiecutter-django) to ensure they all follow the [same guidelines](https://github.com/kingsdigitallab/django-bare-bones).
