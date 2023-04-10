# Background
Node JS backend and NextJs frontend is a frequently used combo for me. Trying to make a logical boilerplate with some easy automations.

## Common patterns of my project
- I like to keep a lot of things in DB
- I like to follow model, route(controller), service, views structure in node js
- I like to manage authentication from BE
- Authorization is controlled from BE which I want to control from FE
- In FE, I keep data, structure, component and style separate
- Every time a new component is added in FE, a few things need to be added
  - a component file
  - a data file/API toget data from BE
  - an import and placement on page
  - a new style group in SCSS
- Every time a new req/res is added in BE, at least the following things are required -
  - a DB query
  - a service function
  - a controller
- Every time a new table is added in BE, at least the following things are required -
  - a model file
  - some entry in DB entry point
  - some relationship (sequelize is used)
  - some basic queries
  - preferable a test route

## Things to achieve
- A reusable fullstack boilerplate
- concurrently driven working script
- Would be great to have some automations
  - Add a table and get relevant modifications
  - Add a component, get relevant files
  - Add a route, get relevant modifications