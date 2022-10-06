---
title: Blog
subtitle: Chopin Online Variorum Edition conference, January 2017
tags:
  - post
  - OCVE
  - Chopin
  - Musicology
authors:
  - Elliott Hall
date: 2017-03-06
excerpt: KDL balance the tensions inherent when digital solutions are applied to
  analogue problems.
feature:
  image: /images/ocve_hero.original.jpg
  description: ocve hero
---

KDL balance the tensions inherent when digital solutions are applied to analogue problems.

On Friday 13 January, I had the pleasure of attending a conference at St John’s College Cambridge, organised by the Chopin Online Variorum Edition project (www.chopinonline.ac.uk/ocve). It was led by PI John Rink and is based on the vast scholarship that he and Christophe Grabowski published in the [_Annotated Catalogue of Chopin’s First Editions_](http://www.chopinonline.ac.uk/aco/) (Cambridge University Press, 2010). I have been involved with the project in one way or another since 2005, first as part of King’s Department of Digital Humanities, and now here at the Lab. The project has sought to make every variant found in the multiple witnesses of Chopin’s works – ranging from manuscripts through to published editions, including annotated scores used by his students -- available in a single resource.

Both OCVE and its sister project Chopin’s First Editions Online (also available through the Chopin Online portal; www.chopinonline.ac.uk/cfeo) are to me classic examples of what putting digital next to humanities has meant so far. On one level, it’s doing what we’ve used computers for since the beginning: automating routine tasks. Rather than hunt down dispersed scores in libraries and private collections all over Europe, then order photocopies, photographs or scans before finally seeing the page or even single bar a person is actually interested in, the whole corpus is available from any browser in the world. All of that tedious indexing, searching and acquiring is done for you by the site, making Chopin’s work more accessible than ever before.

But what we’ve accomplished, challenging as it has been, has still been an outgrowth of earlier ideas. We have improved on the idea of an archive, but not yet used technology to create something fundamentally new.

Now OCVE aspires to do just that by allowing users to combine the variants from different sources, creating their own digital editions for use in day-to-day practice and performance. The conference brought together a diverse community of digital experts to discuss (and good-naturedly argue over) how this might be accomplished, and more importantly to consider what a digital edition is. Neither question is straightforward.

From a technical standpoint the challenges are formidable. Musical notation is a visual language, and translating that language onto screen involves difficult decisions and tradeoffs. Participants at the conference had grappled with this tradeoff, and come down on different points of the spectrum between precision and accessibility. The [LilyPond](http://lilypond.org/) project has decided to emphasize quality music engraving. It produces beautiful scores, but that quality comes at a cost of speed, flexibility and interactivity. Any change requires re-compiling a whole page, and there is currently no browser-based tool for interaction with the engraved music (as opposed to the underlying code). [Verovio](http://www.verovio.org/), on the other hand, is a browser-based javascript tool that emphasizes adaptability. It renders scalar vector graphics that can be manipulated with JavaScript, and is responsive to the screen changes needed to move from desktop to various devices. This flexibility comes at a cost in precision and loss of some of the finer details of a printed engraving, however. [TIDO](http://tido-music.com/) has used the iPad to provide a high quality curated digital experience, but at the cost of placing their work inside Apple’s walled garden, tying it to a specific type of device.

When we at the Lab build resources like this, especially for the web, we are always making tradeoffs between the universal and specific. As developers we are relentlessly trying to standardise everything we can, to make it easier to display content consistently everywhere, not to mention maintain that content. To do that we accept some loss of precision and control. That’s fine for us when it relates to how far left a sidebar is. In a musical score, however, moving a slur even a few pixels to the left can have an impact on how a piece is performed. Paradoxically, the Chopin Online projects are about the opposite of standardisation: they’re interested in anomalies, mistakes and changes of mind because these can give enormous insight into the very essence of the music as Chopin conceived it or as we might wish to perform it. By making things too standard, we developers risk obscuring the very features that make the diverse musical scores in the project so interesting.

In balancing these two competing priorities, the project will have to decide what the minimum standard of interactivity and the acceptable loss of precision will be. In doing so, it will have to answer for itself what a digital edition is, and what it could become.

The next phase of the project will need a variety of partners to work together, coordinating their technical activities and working to a shared plan. The existing OCVE platform could be used to develop if not deliver John's vision for the future of digital musicology; King's Digital Lab looks forward to helping do just that.
