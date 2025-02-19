---
title: Room to Breathe
subtitle: Opening up 3D for Smaller Heritage Organisations
tags:
  - post
authors:
  - Neil Jakeman
date: 2019-12-06
excerpt: ""
feature:
  image: /assets/images/blog/blog_header-scaled.original.jpg
  description: liberty_header
---

_This post also appears on the Sketchfab cultural heritage blog_

Recently I’ve been working with Anna Reading and Jim Bjork of King’s College London, graphic artist Akvile Terminaite, and [Abira Hussein](https://sketchfab.com/Berisamaad) of the Nomad Project on a pilot project to investigate how new technology can be used to replicate or augment the physical experience and also to develop a workflow that will help smaller heritage institutions to join in with a quiet 3D digital revolution.

It’s clear that emerging media forms such as VR and AR storytelling are opening up exciting opportunities for sharing of heritage. Audience appetites are evolving and their expectations of production values are high. However, while large museums and national heritage institutions are able to invest in experimentation with these new media forms, there are many smaller organisations for which digital collections and digital exhibitions are perceived as a low priority use of their scarce resources.

One such institution is the [Migration Museum](https://www.migrationmuseum.org/exhibition/room-to-breathe/) in London. The temporary exhibition [Room to Breathe](https://www.migrationmuseum.org/exhibition/room-to-breathe/), is a thoughtfully curated, physically immersive experience, which tells the stories of many migrants coming to the UK and aims to disrupt populist rhetoric around what it means to be British. The content was co-created by working with communities who have contributed many items and memories to the exhibition. Although the exhibition is free-roaming, visitors are subtly guided through a series of environments; an Arrivals space, a generic Bedsit, a busy Kitchen, a School Classroom and even a Barber’s shop. Hidden throughout in plain sight are stories, attached to objects which tell us about the experiences of settling in a new place.

The exhibition has welcomed numerous visitors, many of them schoolchildren, and has received very positive feedback. It seems a shame that such an impactive exhibition must eventually be dismantled, packed away, and remembered only by a few fortunate visitors. What if it were possible instead, to bring the experience to new audiences, some perhaps reluctant to engage with the material, or too far away, and or less mobile?

## Planning for Maximum Reuse

We aim to demonstrate that even with a modest budget and a bit of imagination, the essence of an exhibition can be preserved and disseminated. We also want to develop a methodology that looks forward, over the technological horizon, so that as access to technology becomes more affordable, smaller institutions will be well poised to take advantage of it.

We began work in June 2019 with a workshop that brought together expert voices from museology, media production ([The Mill](http://www.themill.com/)), academia, and community stakeholders. It was important as a day of fact-finding and for refining the scope for the project. Everyone was invited to talk about what they thought was striking about the exhibition and what it meant to them. For those that were less familiar with immersive technologies, we demonstrated some immersive experiences and talked about the very different sorts of outputs that could be thought of as immersive in some way. There were breakout groups to generate ideas about the elements we might include in any digital recreation, and how they might work together as a whole.

## Digitisation

In whatever ways we eventually decided to remix the elements of Room to Breathe, we would need to efficiently digitally capture it.

Our capture process started very methodically, by making lists. Even in a small exhibition the amount of potential content soon becomes overwhelming. We needed to decide what is content, what is environment, and what it is we are trying to achieve. Initially adopting an archival approach, we performed an Analytical Inventory of the collections. For this inventory the items were described in terms of their overall role in the exhibition, and from these assessments a capture strategy would be assigned. For instance, No Capture Needed, or Low Priority, or Important Environmental Items, or Research Grade Items. (This last term, Research Grade, would be more suited to museums that house artifacts that invite detailed examination and comparison with other items in other collections, i.e., they should be digitised in great detail with good quality metadata).

This initial scoping of the collection helped to whittle down our ideas and allowed us to focus our efforts on what was practically achievable in our project timeframe. We devised protocols for digitising the different items but ultimately chose to concentrate on one or two settings so that we might develop the most mature prototypes for testing in the time available.

A few approaches were considered for capturing the spaces for later use in an immersive platform: 360-degree images, photogrammetry, direct 3D modeling, or a mixture of all of the above. Capturing entire rooms with photogrammetry is challenging, not least because of the computing power needed. Flat surfaces without much contrast often result in messy and uneven meshes, and heavily occluded areas are tricky to get to. However, we wanted to make use of photogrammetry for several reasons. Firstly, it’s relatively easy to get decent results with only a little training. Secondly, when licensed for educational use, a product like Agisoft’s [Metashape](https://www.agisoft.com/) is very affordable. We hoped that a combination of simple modeling from geometric primitives coupled with photorealistic textures might produce pleasing results.

Our first outputs with photogrammetry scans suffered from the problems described above. Take, for example, the bedroom area of the exhibition: a point cloud representation provides an evocative sense of space and light and offers a pointillist aesthetic that has its own appeal, but we felt that it wouldn’t provide a suitable environment to host an interactive experience.

[Classroom](https://sketchfab.com/3d-models/classroom-88886bc5f3264861bd629f9e231c52a7?utm_medium=embed&utm_source=website&utm_campaign=share-popup) by [King's Digital Lab](https://sketchfab.com/kingsdigitallab?utm_medium=embed&utm_source=website&utm_campaign=share-popup) on [Sketchfab](https://sketchfab.com?utm_medium=embed&utm_source=website&utm_campaign=share-popup)

Using the point cloud to create a mesh surface produced the least pleasing results, and the complex geometry would be very ill-suited for use in a game engine. At this early stage we wanted to keep our options open as to how the output should be consumed. We reasoned that we could always downscale our models for different uses.

Another approach we explored was the ‘_snowglobe_’ environment approach in which a 360-degree equirectangular image is projected onto the inside of a sphere. This method allowed us to make use of Sketchfab’s annotation tools but it was limiting in terms of how far the space could be navigated by the user. Interestingly, the museum staff was keen on this approach as a quick and reliable way of documenting the arrangement of the spaces, which was useful for when they approached new funders. We found that even on low-end 360-degree cameras, we were able to take multiple exposures (under, over, just right) and to use High Dynamic Range (HDR) to preserve as much tonal variation as possible:

[RtB Classroom HDR Snowglobe](https://sketchfab.com/3d-models/rtb-classroom-hdr-snowglobe-b8f02353121d495fae30522b724ab7c2?utm_medium=embed&utm_source=website&utm_campaign=share-popup) by [King's Digital Lab](https://sketchfab.com/kingsdigitallab?utm_medium=embed&utm_source=website&utm_campaign=share-popup) on [Sketchfab](https://sketchfab.com?utm_medium=embed&utm_source=website&utm_campaign=share-popup)

We also experimented with creating an abstract version of one of the spaces, reasoning that verisimilitude was, in some ways, less important than communicating the driving rationale of the exhibition. Akvile Terminaite created a 2D interpretation of the space which we then recreated in 3D in [Gravity Sketch](https://www.gravitysketch.com/). Given that we plan to develop this model into a space that can be explored by school pupils, this simplification might yet prove to resonate with a cohort who have developed an intuitive understanding of video game environments:

[Abstract Classroom - Room to Breathe](https://sketchfab.com/3d-models/abstract-classroom-room-to-breathe-d1a0b961a36a4aa2a3f8bf95a1d473f1?utm_medium=embed&utm_source=website&utm_campaign=share-popup) by [fieldworks](https://sketchfab.com/fieldworks?utm_medium=embed&utm_source=website&utm_campaign=share-popup) on [Sketchfab](https://sketchfab.com?utm_medium=embed&utm_source=website&utm_campaign=share-popup)

Ultimately, through mixing photo textures with simple modeling in [Blender](https://www.blender.org/), we created a version of the classroom space that is largely realistic in its interpretation and faithful to the original space. It serves dual purposes as an archival approach and as a model that is well optimised to be used in a game engine:

[RTBClassroomV2](https://sketchfab.com/3d-models/rtbclassroomv2-88e38a07cbd34d3a810041ad5a9fc3af?utm_medium=embed&utm_source=website&utm_campaign=share-popup) by [King's Digital Lab](https://sketchfab.com/kingsdigitallab?utm_medium=embed&utm_source=website&utm_campaign=share-popup) on [Sketchfab](https://sketchfab.com?utm_medium=embed&utm_source=website&utm_campaign=share-popup)

[Room to Breathe Bedroom](https://sketchfab.com/3d-models/room-to-breathe-bedroom-b2c8f22434c54f57bdbfb46a860fb1e7?utm_medium=embed&utm_source=website&utm_campaign=share-popup) by [King's Digital Lab](https://sketchfab.com/kingsdigitallab?utm_medium=embed&utm_source=website&utm_campaign=share-popup) on [Sketchfab](https://sketchfab.com?utm_medium=embed&utm_source=website&utm_campaign=share-popup)

## Designing the Experience

We chose to focus on a school audience for a prototype learning experience. VR is generally a solo experience and we wanted school kids to be able to share an experience and for that experience to be a catalyst for conversation and debate. For this reason, we settled on remixing our assets into an AR experience.

In keeping with the project ethos of using simple and functional tools, we discovered that [TorchAR](https://www.torch.app/) offered a great way to compose an AR experience using an intuitive drag-n-drop interface on recent iOS devices. Of course not everyone will have access to these devices, but we felt that this restriction on platform was a reasonable compromise. Sketchfab proved invaluable for sharing works in progress and as a means of getting content into our AR application as TorchAR can download directly from Sketchfab.

In our prototype we have a very specific experience in mind for schoolchildren. In groups of two, they will share an iPad, using it as a *window-on-the-world* to move around the virtual exhibition. Much like in the physical space, stories can be accessed through touch or proximity and might be read or listened to, or both. The experience should be considered as a supplement to a taught class. It is designed to stimulate classroom conversations and inspire new reflective work. Anyone is able to view the work so far if they have a recent iOS device by following the [link](https://home.torch.app/projects/view/RnQBRYFU1B4N6YglgZ79).

Basic user testing has taken place and we now understand that we need a reasonable amount of space (say a school dinner hall), and a static environment to get the best out of the experience. Users often need encouragement or guidance to understand that they can move around the virtual space and might need to bend down, or look up to interact with different elements.

In the most recent version of the AR experience, there are three separate spaces to explore. We didn’t have the time to stress-test the software and so we only show one space at a time, with movement between the spaces being triggered by touch interactions. Of course, there is some artistic license at work in how the spaces have been interpreted but we feel we kept the *spirit* of the exhibition intact. (We encourage you to have a go, touch everything, move around, and remember to bend your knees! Do let us know if you get stuck in any dead-ends)

## Afterword

The project began with the conviction that any organisation, using the right approach, can make use of immersive technology to widen their audience. In reality, the workflow is often complex and requires multiple iterations, but small projects like this one have enabled us to partially refine a workflow that should be accessible to all. Tools like Sketchfab and TorchAR are invaluable assets for authoring and collaborating in this work. In due course, King’s Digital Lab plans to publish guidelines that will accompany our Software Development Life Cycle for Humanities Research. Please do follow us on Twitter to stay up to date with this and other projects!
