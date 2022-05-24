# KDL Web Project

## Set up

### CMS

Set up [Docker](https://www.docker.com/):

    cp docker-compose.override.yaml.example docker-compose.override.yaml

Set up the environment files:

    cd .envs
    cp .cms.example .cms
    cp .database.example .database

Run the stack:

    npm run up

The cms is available at http://localhost:8055/ by default and if no port
configuration was changed.

#### Data model versioning

Create a snapshot:

    npm run cms:snapshot

Apply a snapshot:

    npm run cms:snapshot:apply --snapshot=SNAPSHOT_NAME

Where `SNAPSHOT_NAME` is the name of the snapshot without path or extension. By default
the data model snapshots are stored at [cms/snapshots](cms/snapshots/README.md).

### Data model

This data model is based on the [schema.org](https://schema.org/) vocabulary.

```mermaid
erDiagram
    AGENT }o--o{ LINKROLE: url
    AGENT ||..o{ ORGANISATION: is
    AGENT }o--o{ ORGANISATION: memberOf
    AGENT ||..o{ PERSON: is
    AGENT {
        string name
        string alternateName
        string description

    }

    ORGANISATION ||--o| ORGANISATION: department
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
    PROJECT ||--o| IMAGE: image
    PROJECT }o--o{ LINKROLE: url
    PROJECT ||--o{ ORGANISATION: department
    PROJECT }o--o{ AGENT: funder
    PROJECT }o--o{ AGENT: member
    PROJECT }o--o{ PROJECT: relatedTo
    PROJECT {
        string name
        string alternateName
        date foundingDate
        date dissolutionDate
        text description
    }

    ROLE ||..o{ LINKROLE: is
    ROLE {
        string name
        date startDate
        date endDate
    }

    LINKROLE {
        string url
    }

    WEBPAGE ||--|{ AGENT: author
    WEBPAGE }o--o{ AGENT: contributor
    WEBPAGE ||--o{ DEFINEDTERM: keywords
    WEBPAGE ||--o| IMAGE: image
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
