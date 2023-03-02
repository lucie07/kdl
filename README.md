# KDL Web Project

[![Build 11ty frontend](https://github.com/kingsdigitallab/kdl/actions/workflows/frontend.yml/badge.svg)](https://github.com/kingsdigitallab/kdl/actions/workflows/frontend.yml)
[![pages-build-deployment](https://github.com/kingsdigitallab/kdl/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/kingsdigitallab/kdl/actions/workflows/pages/pages-build-deployment)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/kingsdigitallab/kdl/tree/components)

## Set up

### Dependencies

- [Docker](https://www.docker.com/)
- [Node](https://nodejs.org/) 16

Install the node packages:

    npm install

Install the git hooks:

    npx simple-git-hooks

### CMS module

Set up Docker:

    cp docker-compose.override.yaml.example docker-compose.override.yaml

Set up the environment files:

    cd .envs
    cp .cms.example .cms
    cp .database.example .database
    cp .etl.example .etl

Run the stack:

    npm run up

The cms is available at <http://localhost:8055/> by default and if no port configuration
changed.

#### Data model versioning

Create a snapshot:

    npm run cms:snapshot

Apply a snapshot:

    npm run cms:snapshot:apply --snapshot=SNAPSHOT_NAME

Where `SNAPSHOT_NAME` is the name of the snapshot without path or extension. By default
the data model snapshots are saved in [cms/snapshots](cms/snapshots/README.md).

### Data model

This data model is based on the [schema.org](https://schema.org/) vocabulary.
Local customisations are prefixed with `KDL` and models internal to the CMS
are prefixed with `CMS`.

```mermaid
erDiagram
    AGENT }o--o{ LINKROLE: url
    AGENT ||..o{ ORGANISATION: is
    AGENT ||..o{ PERSON: is
    AGENT }o--o{ KDLROLE: memberOf
    AGENT {
        string name
        string alternateName
        string description

    }

    ORGANISATION ||--o| ORGANISATION: parentOrganisation
    ORGANISATION {
        date foundingDate
        date dissolutionDate
    }

    DEFINEDTERMSET ||--o{ DEFINEDTERM: hasDefinedTerm
    DEFINEDTERMSET ||--o{ LINKROLE: url
    DEFINEDTERMSET {
        string name
    }

    DEFINEDTERM ||--|| DEFINEDTERMSET: inDefinedTermSet
    DEFINEDTERM {
        string name
    }

    PROJECT ||--|| DEFINEDTERM: creativeWorkStatus
    PROJECT }o--o{ DEFINEDTERM: keywords
    PROJECT ||--o| cmsIMAGE: image
    PROJECT }o--o{ LINKROLE: url
    PROJECT ||--o{ ORGANISATION: department
    PROJECT }o--o{ AGENT: funder
    PROJECT }o--o{ KDLROLE: member
    PROJECT }o--o{ PROJECT: relatedTo
    PROJECT {
        string name
        string slug
        string alternateName
        date foundingDate
        date dissolutionDate
        text description
    }

    KDLROLE ||--|| AGENT: agent
    KDLROLE ||--|| ORGANISATION: inOrganisation
    KDLROLE ||--|| PROJECT: inProject
    KDLROLE {
        string name
        date startDate
        date endDate
    }

    LINKROLE {
        string name
        date startDate
        date endDate
        string url
    }

    WEBPAGE ||--|{ AGENT: author
    WEBPAGE }o--o{ AGENT: contributor
    WEBPAGE ||--o{ DEFINEDTERM: keywords
    WEBPAGE ||--o| CMSIMAGE: image
    WEBPAGE }o--o{ AGENT: about
    WEBPAGE }o--o{ PROJECT: about
    WEBPAGE ||--|| WEBPAGE: isPartOf
    WEBPAGE ||--o{ WEBPAGE: hasPart
    WEBPAGE {
        string name
        string slug
        string type
        text abstract
        text text
    }
```
