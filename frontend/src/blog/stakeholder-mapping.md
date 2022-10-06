---
title: Making sense of the Stakeholder Map
subtitle: A focused approach for high-level requirements
tags:
  - post
  - Requirements
  - Stakeholders
authors:
  - Neil Jakeman
date: 2022-06-28
excerpt: We recently embarked with partners on an AHRC funded scoping exercise,
  to define the specifications of a Complex 3D Data Repository for the Arts and
  Humanities.
feature:
  image: /images/blog_banner_aX9rBsr.original.jpg
  description: MarconiTapper
---

We recently embarked with partners on an AHRC funded scoping exercise, to define the specifications of a [Complex 3D Data Repository for the Arts and Humanities](https://blogs.brighton.ac.uk/3ddataservice/).

These data have the potential for positive public impact by virtue of being visually engaging and accessible to a range of audiences. They can also be of immense pedagogical value, acting as digital surrogates for real-world items or helping to visualize interpretations of past environments.

Worryingly, our early research suggests that many datasets end up in silos, on personal laptops, or are lost completely to the ravages of software obsolesence. Often, the unique affordances of 3D data are reduced to a few minutes of animation on a well known video streaming platform. 3D metadata standards are mixed, and the variety of file formats is dizzying and volatile, ranging from proprietary point clouds scans to open-source voxel sculptures, from born-digital geometric compositions to RTI texture captures.

Drawing a clear line around what should be encapsulated by our remit is a challenge in itself. Yet we have to take a holistic perspective of requirements that goes beyond simple lists of file types and desirable functionality. This sort of information is next to meaningless without a thorough understanding of the needs of the communities we want to empower.

During our first workshop in March 2022 at the National Gallery, we enjoyed the company of many GLAM sector professionals, independent developers, infrastructure specialists and academic researchers, each bringing an invaluable perspective honed through years of thinking on the same problems we hoped to remedy.

These sorts of events always benefit from a variety of presentations which cumulatively help to clarify and frame the problems. We all have our assumptions challenged by listening to others and assimilating their experiences.

It would be folly to expect to have representation from every stakeholder invested in the design of this infrastructure. To draw on the expertise that was gathered we opted to perform a baseline stakeholder mapping - who and what are the various roles and entities that would stand to benefit from this 3D Data Repository service? Furthermore, which of them are central to a successful outcome and which will benefit tangentially? We set five groups the succesive tasks of:

1.  ### Identifying different stakeholders

    Who do we need to service?

2.  ### Characterising their requirements

    What do they need to do?

3.  ### Prioritizing stakeholders according to a matrix influence and interest

    How should we concentrate our efforts?

After clustering responses our groups had identified no less than 73 separate stakeholders, some of which were completely unexpected - CGI prop designers, Adopt-a-model enthusiasts, Guerilla scanning armies - and some were more conventional - Early Career researchers, Image licensers, GLAM Legal teams. In characterising the repsective interest areas of these stakeholders, we were able to cluster again and define this set of core concerns:

**Main interest areas**

**Expanded description**

**Accessibility**

_Service should be inclusive in its design, catering for differently abled audiences and different levels of expertise_

**Compliance**

_Service should facilitate and encourage best practice_

**Content creation**

_As permitted by contributors, service should enable downstream economies in derivative products_

**Creative Industries**

_As permitted by contributors, service should enable downstream economies in derivative products_

**Discovery**

_Service should enable effective search and filtering through submitted content by criteria to be defined during the scoping process_

**Education**

_Service should provide opportunities to enrich learning experiences through access to content_

**Engagement**

_Service should proactively engage with the diverse communities it serves, providing guidance, training and best practice_

**Equipment**

_Service should enable the acquisition of new heritage content through connecting researchers to digitization services and equipment_

**Equitability**

_Related to accessibility, yet also referring to aspects of the decolonization agenda_

**Funding**

_Service should inspire confidence in its continued sustainability_

**Impact**

_Service should provide reporting tools for collections_

**Preservation**

_Service should ensure long-term availability of deposited content_

**Public Engagement**

_Service should reach beyond the primary audiences_

**Research functionality**

_Service should provide analytical tools to interact with the content_

**Reuse**

_Data should be accessible for continued research and for demonstrating reproducibility_

**Revenue Generator**

_Content owners are able to control access and licensing of their data, according to UK law, for specified purposes_

**Sustainability**

_Codebase should be modular and open, with a clear roadmap for business development over decades_

**Usability/Workflows**

_User Interactions and Experience should enhance and encourage best practice, and provide a “generous” interface_

Based on the number of mentions and co-occurence of these interest areas between stakeholders we attempted to visualise their relative importance and gain a clear sense of the areas that intersect:

![VennDiagram](/images/venn_fig_1_report.width-1024.jpg)

Fig. 1. Venn diagram of intersecting needs and proportional importance

Of course, writing a technical specification to meet 73 different personas isn't really practical, but by mapping the unique stakeholders on a matrix of Influence vs Interest, some clear clusters began to appear:

- Education and Research users
- Creative use and downstream economies
- Heritage Organizations
- Engaged publics
- Compliance and legal offices
- Funding bodies
- Others / edge cases

Aggregating the stakeholders in this way helps to simplify the tasks of:

- defining the needs and responsibilities of each group
- defining the 'pain points' they experience in trying to achieve those needs
- suggesting remedial actions
- articulating the gains acheived through implementing the remedial action

For instance, an example could read as follows:

## HEI Researcher "needs" example

1.  ### Job / Task

    Demonstrate impact to secure new funding

2.  ### Pain point

    Difficulty quantifying public engagement

3.  ### Pain relief

    Provide tracking of use and citation

4.  ### Remedy

    Generate reports which are targeted at REF requirements, quantifying and characterizing impacts

The conceptual journey described above is a useful tool as it asks us to restate the issues from several perspectives and goes a long way to ensuring nothing is overlooked from our more sprawling stakeholder findings. We performed this exercise for each major stakeholder cluster and the outputs are immensely helpful in refining our ultimate recommendations.

Having so much collected experience together in one workshop, we also took the opportunity to ask delegates to think about what was likely to change over the next 5 to 10 years in this domain. As an "end-of-a-long-day" activity this was intended as a fun exercise in futurology and playful speculation, but it was also possible to pick out valuable narratives that we needed to consider when compiling our roadmap for a sustainable resource that would continue to meet changing needs.

![timeline v5](/images/timeline_v5.width-1024.png)

Fig. 2. How will 3D data change over the next decade?

In summary we see these stories unfolding:

- Over the next 7 years, we predict that public awareness of, and access to 3D technology will steadily increase, leading to large-scale crowdsourcing of content
- In the next 1-3 years, we expect that big-tech will both invest heavily in, and then abandon multiple tools and initiatives. This is likely to be cyclic behaviour though
- 2 to 4 years from now, increased availability of 3D technology will be empowering disenfranchised custodians of cultural heritage to repatriate collections virtually
- Between 2 and 6 years from now, the metaverse will stimulate new markets in 3D content
- Simultaneously, AI advances will simplify the processes of content creation
- 5 years on, we expect that at least one major file format will become obsolete, underlining the importance of open standards for long-term secure deposition
- 6 years from now, increasing awareness of environmental impacts should influence responsible choices around sustainable infrastructure
- 7 to 9 years in, we expect an avalanche of potential data from spatially aware devices, from mobile phones to robot vacuum cleaners
- 10 years away, we consider that new forms of complex data may supersede 3D formats

These finding helped us immensely in framing our problem and setting the agenda for more detailed work.

This project continues with a second workshop in Edinburgh on July 7th 2022 and a community survey is still open for contributions so please do share your experiences!

Survey link : [Scoping a 3D Data Service](https://survey.chws.brighton.domains/index.php/862148?lang=en)

Better still, if you can make it to the workshop, you can register here:

Workshop link: [Multi-Dimensional Visual Datasets in the Arts and Humanities - Workshop 2](https://www.eventbrite.co.uk/e/multi-dimensional-visual-datasets-in-the-arts-and-humanities-workshop-2-tickets-344783465627)

#

## Project Consortium and Funder

[![Project Consortium](/images/ConsortiumLogos.width-300.png)](https://blogs.brighton.ac.uk/3ddataservice/team/)
