---
title: The road to a more inclusive web
subtitle: The state of digital accessibility at KDL
tags:
  - post
  - accessibility
authors:
  - Ginestra Ferraro
date: 2021-04-22
excerpt: >-
  Recently I was asked to present the lab’s progress on the work done to improve
  accessibility in our products to the Digital Accessibility Programme Board at
  King’s.


  KDL joined the board from day one to help shape the College’s digital accessibility policy and help scope the work that needed to be done to make every platform as accessible as possible.
feature:
  image: /images/liane-metzler-v3bWNXeInQA-unsplash-small.original.jpg
  description: Liane Metzler Unsplash - White stairs
---

Recently I was asked to present the lab’s progress on the work done to improve accessibility in our products to the Digital Accessibility Programme Board at King’s.

KDL joined the board from day one to help shape the College’s digital accessibility policy and help scope the work that needed to be done to make every platform as accessible as possible.

Every designer I have met in my eight years at King's has been invested in creating accessible designs, but there was never a solid workflow embedded in our processes to go about it. When the [new government regulations](https://www.legislation.gov.uk/uksi/2018/952/contents/made) came out in 2018, KDL took the opportunity to update its approach to accessibility, make it more formal, robust and better integrated with its Software Development Life Cycle (SDLC).

## Ask an expert

We decided to have an independent body assess where we stood with respect to accessibility at the time to get an honest picture and remove any potential bias.

I have attended more than one event where I listened to [Léonie Watson](https://twitter.com/LeonieWatson), from [TetraLogical](https://tetralogical.com/), present on web accessibility and so I got in touch with her. She agreed to run a light assessment on a sample of our products and produce a short report highlighting issues and offering recommendations.

What we received is called a "gap analysis report". The results were not flattering. We discovered that in our customisation of the front-end stack, we had introduced some issues and were not meeting [WCAG A standards](https://www.w3.org/TR/WCAG21/). Focusing on the positives: most of the big issues were easy to fix and we knew where to start.

![Gap analysis data screenshot](/images/gap-analysis-data-screenshot.width-1024.png)

_Fig. 1_ A screenshot of the gap analysis document section where some results are highlighted, in particular:  
32 Level A issues affecting 38% of the website (8409 pages) and 4 Level AA issues affecting 1% of the website (133 pages).

## Embrace the work

With the regulations being blurry on who would be affected and the College yet to set a wide policy, I saw this as an opportunity for the KDL team to take the initiative and commit to accessibility for all its digital outputs.1 This commitment requires an investment in resources, a wide collaboration across the team and, more importantly, **a shared view on the importance of the work we were about to embark on**.

KDL actively takes part in the [Equality, Diversity and Inclusion](https://www.kcl.ac.uk/hr/diversity) work done at King's and improving our digital accessibility is in line with our philosophy and ethics of design and development.  
From a research impact and business point of view, choosing to improve digital accessibility is also the way forward:

- A more accessible site reaches a wider audience.
- A more accessible site is likely to be more sustainable.
- Digital accessibility should (hopefully) be a requirement for all web products in the future; getting ahead of the game and establishing a robust workflow early on, will pay off.

That said, we knew we were taking on a massive task. KDL inherited circa 100 legacy websites in 2015 when it was created.

We were faced with:

- Legacy technical stacks and infrastructure resulting in no ability to automate the accessibility assessments for most sites.
- Limited resources available in the lab: at the time of writing only 1.5 FTE designers, who take on the biggest share of the accessibility work, and a little less than 4.0 FTE developers, although more people contributed to the accessibility work over time.
- We also had (and still have) 2 or 3 dozen of active projects running at any given time.

In 2019/2020 KDL was able to temporarily expand the design team; partial justification for the expansion, was, in fact, to undertake the "accessibility treatment", as we begun to call it, of our products. We went from 2.0 FTE to 3.0 FTE, including an intern.  
I’d like to take this opportunity to thank the staff that joined us then, for the effort they put into improving our design outputs as a whole, and in particular for the impact they had in pushing the work on accessibility off its starting blocks:

- **Cindy Fu**, KDL Research Software UI/UX Designer (2020)
- **Olga Loboda**, KDL Research Software UI/UX Designer (2019-2021)
- **Yu Fei**, Department of Digital Humanities Student Intern (2020)

## Set the objectives and build a routine. Actually, build two.

To get the work underway, we had to figure out where in our process accessibility would fall.

The five phases in our design workflow are:

- **Research**
- User requirements definition
- Workshop(s) with project partners
- **Design iterations and user testing**
- Launch

![KDL UX workflow](/images/UX-design-workflow.width-1024.png)

_Fig. 2_ KDL's design workflow.

Accessibility is present in each phase, but we identified _Research_ and _Design iterations and user testing_ as the two phases where we actively plan and work on it the most.

While this approach works well for new projects — allowing us to plan accordingly, test frameworks and tools beforehand and set out usability testing with targeted objectives to cover accessibility as well as user experience (UX) — it doesn’t really fit legacy projects, where we have to test a finished product and consider the impact any little change would have in terms of implementation and roles in the lab who will need to be involved (designers, developers, system admins, project managers and analysts alike).

This resulted in two different approaches: one for legacy projects, one for current and new ones.

The latter follows the design workflow, with continuous integration and final testing before launch. The former became an _ad hoc_ one.

We compiled a list of legacy websites and prioritised them following [MoSCoW principles](https://en.wikipedia.org/wiki/MoSCoW_method), using the following criteria to assign higher priorities:

- Projects that were to be submitted as research outputs or as part of impact case studies to [REF 2021](https://www.ref.ac.uk/).
- Recent date of publishing since they were likely to have more traffic.
- Traffic data from analytics and considerable public engagement, for the same reason as above.
- And finally, the (often dated) software and infrastructure the resource was sitting on: we had to consider how feasible it was to assess and edit the resource without breaking it (the more fragile its state, the lower the priority).

We also excluded sites that could be considered archives based on the definition of archive in the UK government regulations.2

**The result is a list of circa 90 sites, of which, at the time of writing, 17 have been rendered accessible, 2 are in progress, 4 in the pipeline and the rest of the list will be revaluated in due course to reassign priority.**

![Screenshot of a bird’s eye view of the prioritised spreadsheet.](/images/Screenshot_2021-04-19_at_12.03.48.width-1024.png)

_Fig. 3_ Screenshot of a bird’s eye view of the prioritised spreadsheet.

## Evaluate

17 out of 90 doesn't seem like much, and we might consider the progress to be relatively slow, but when we take into account the manual labour that had to go into the task, we can claim it as a success. The work is not complete, but it's moving forward.  
The confirmation we received from the legal team that our outputs don't fall under the Public Sector Bodies umbrella laid out by the regulations, relieves some urgency but does not resolve our professional imperative and we can continue to build upon what we have done.

We have learned a lot in the last two years and a half, and have identified some technical and workflow issues, some of which are only relevant for the more problematic work on legacy sites:

- **Little to no automation**
  - Our sites don't sit in the standard College ITS environment, so we are not able to take advantage of the College instance of [**Siteimprove**](https://siteimprove.com/). Having our own instance of the software is **too expensive**.
  - We are currently tracing all detectable WCAG issues **using Siteimprove's plugin for Google Chrome** and compiling a list manually for every product assessed.
  - We are **experimenting with [pa11y](https://pa11y.org/)**, an open-source tool to crawl sites and highlight accessibility issues.
- **Content curation responsibility**
  - KDL often acts as the technical partner in research projects. Our core contribution is designing and developing software, and providing technical documentation.
  - We rely on project partners to generate their own content. We can only offer support in finding guidelines to write accessible content (eg. KDL REF checklist [10.5281/zenodo.3361580](https://zenodo.org/record/3361580)).
  - When KDL does generate content, it is indeed responsible to make it accessible.
- **Experimental work and highly interactive content**
  - Some of our projects are exploratory, and there are no widely accepted standards yet when it comes to accessibility (eg. Immersive experience (XR), 3D rendering, data visualisations, etc.)
  - KDL sees these as opportunities to be on the front line to define those standards.

## What's next?

KDL’s commitment to accessibility means that we are consolidating our design workflow and integrating it into our SDLC to smooth the process.  
We are adding more automated testing, allocating resources with more accurate estimates and continuing to contribute to the College-wide policies on accessibility.  
I have personally noticed a different awareness and approach when it comes to this subject and can appreciate the evolved ethos around it.  
Everyone in the team is playing a part: from analysts including accessibility and usability testing in product quotes, to project managers overseeing the workflow integration, from developers assessing and implementing more accessible software and testing platforms, to system admins ensuring everything is supported by our infrastructure.  
Designers may be the main point of contact and responsible for bringing the topic to the table, but it has taken the whole team, top to bottom (which in a flat structure such as KDL's, is wider rather than tall), to get where we are.

This extract from the [government guidelines](https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps) on digital accessibility is something to share far and wide, to understand the importance of accessible content:

> Even if you’re exempt from the accessibility regulations, or judge that meeting them would be a disproportionate burden, under the Equality Act 2010 or the Disability Discrimination Act 1995 (in Northern Ireland) you’re still legally required to make reasonable adjustments for disabled people when they’re needed - for example, by providing the information they need in another, more accessible format.
>
> gov.uk

In my opinion, striving for perfection is always a double-edged sword: it motivates you to do better, but it might also make you feel like the work is never really completed. I consider it healthier to think in terms of progression, rather than ultimate and definitive results. When it comes to digital products, they are hardly ever final. My view is that **the work is unlikely to be perfect on its first release, but it's okay as long as it is an improvement of the previous version, and it becomes more inclusive with each iteration**.

---

1 These considerations were made before we received confirmation from the legal team at King's, that our outputs don't require the "accessibility treatment", as we begun to call it, as they are considered research outputs. Nonetheless KDL remains committed to accessibility.

2 Following the "archive" definition provided by the [UK government regulations](https://www.legislation.gov.uk/uksi/2018/952/regulation/4/made):  
   (3) In this regulation—  
     (a) "archives" means a website or mobile application which—  
       (i) only contains content that is not needed for active administrative processes; and  
       (ii) is not updated or edited after 23rd September 2019;
