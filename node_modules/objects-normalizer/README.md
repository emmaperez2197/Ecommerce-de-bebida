# Objects Normalizer

## Code Quality Status
![Build Status](https://github.com/gastonpereyra/objects-normalizer/workflows/Build%20Status/badge.svg)
[![Coverage Status](https://img.shields.io/coveralls/github/gastonpereyra/objects-normalizer/master.svg)](https://coveralls.io/r/gastonpereyra/objects-normalizer?branch=master)

![npm-object-normalizer](https://user-images.githubusercontent.com/39351850/90986214-66554080-e557-11ea-9497-8262238b8e08.png)

## Description
Normalizes object keys, to have all the same ones

## Installation

```
npm i objects-normalizer
```

## Params

### items

*Object* or *Array of Objects*.

The set of data to normalize.

#### Conditions

* If set is empty, return an empty list.
* If only one object is passed, only one object is return
* List of objects, returns a list of objects

#### Examples

Single Object

```json
{
    "name": "Kamala Khan",
    "alterego": "Miss Marvel",
    "superpower": "super-stretch"
}

```

List of Objects

```json
[
    {
        "name": "Kamala Khan",
        "alterego": "Miss Marvel",
        "superpower": "super-stretch"
    },
    {
        "name": "Lois Lane",
        "alterego": "Lois Lane",
        "superpower": "press",
        "city": "Metropolis"
    },
]

```

### options

*Object*.

The way to normalize.

* `fieldsToKeep`: *array of strings*, list of fields to keep after formatting.
* `fieldsToRemove`: *array of strings*, list of fields to remove.

#### Conditions

* Only one of them, if both is passed, `fieldsToKeep` has priority, an will be considered the only option.
* If any of them is passed, or another non-supported property, or nothing is passed, will return the same object or objects without modifications.

#### Examples

```json
{
    "fieldsToKeep": ["name", "city"]
}
```

```json
{
    "fieldsToRemove": ["name", "city"]
}
```

## Usage

### objectNormalizer(items)

Items without any option or valid options.

```js
const objectsNormalizer = require('objects-normalizer');

objectsNormalizer({ name: 'Bruce Wayne', alterego: 'Batman', superPower: 'money' });

// It's equivalent
objectsNormalizer({ name: 'Bruce Wayne', alterego: 'Batman', superPower: 'money' }, {});
objectsNormalizer({ name: 'Bruce Wayne', alterego: 'Batman', superPower: 'money' }, { fieldsToDuplicate: ['city']});

/*
    output: 
    {
        name: 'Bruce Wayne',
        alterego: 'Batman',
        superPower: 'money'
    }
*/
```

### objectsNormalizer(items, { fieldsToKeep: [fields] })

Format items to only keep some fields. If these fields not exist in the items, will not be added.

```js
const objectsNormalizer = require('objects-normalizer');

const superHeroes = [
    { name: 'Bruce Wayne', alterego: 'Batman', superPower: 'money', city: 'Gotham' },
    { name: 'Peter Parker', alterego: 'Spiderman', superPower: 'spider things but stronger', city: 'New York' },
    { name: 'Zatanna Zatara', alterego: 'Zatanna', superPower: 'magic'},
    { name: 'Ororo Monroe', alterego: 'Storm', superPower: 'weather control' }
];

objectsNormalizer(superHeroes, { fieldsToKeep:['name', 'city'] });

// It's equivalent
objectsNormalizer(superHeroes, { fieldsToKeep:['name', 'city'], fieldsToRemove: ['alterego', 'superPower'] });
objectsNormalizer(superHeroes, { fieldsToKeep:['name', 'city'], fieldsToRemove: ['name', 'city'] });

/*
    output: 
    [
        { name: 'Bruce Wayne', city: 'Gotham' },
        { name: 'Peter Parker', city: 'New York' },
        { name: 'Zatanna Zatara' },
        { name: 'Ororo Monroe' }
    ]
*/

objectsNormalizer(superHeroes[0], { fieldsToKeep:['name', 'city'] });

/*
    output: { name: 'Bruce Wayne', city: 'Gotham' }
*/
```

### objectsNormalizer(items, { fieldsToRemove: [fields] })

Format items to remove some fields and keep the others.

```js
const objectsNormalizer = require('objects-normalizer');

const superHeroes = [
    { name: 'Bruce Wayne', alterego: 'Batman', superPower: 'money', city: 'Gotham' },
    { name: 'Peter Parker', alterego: 'Spiderman', superPower: 'spider things but stronger', city: 'New York' },
    { name: 'Zatanna Zatara', alterego: 'Zatanna', superPower: 'magic'},
    { name: 'Ororo Monroe', alterego: 'Storm', superPower: 'weather control' }
];

objectsNormalizer(superHeroes, { fieldsToRemove:['name', 'city'] });

/*
    output: 
    [
        { alterego: 'Batman', superPower: 'money' },
        { alterego: 'Spiderman', superPower: 'spider things but stronger' },
        { alterego: 'Zatanna', superPower: 'magic'},
        { alterego: 'Storm', superPower: 'weather control' }
    ]
*/

objectsNormalizer(superHeroes[0], { fieldsToRemove:['name', 'city'] });

/*
    output: { alterego: 'Batman', superPower: 'money' }
*/
```