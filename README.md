Project Black
=============

A Home Automation system using Meteor (named after colour of the notebook in which it all started).

Project Organisation
--------------------

###Single Global

Project Black introduces a single variable `Black` into the global namespace, shared on both client and server. 

In order to ensure that this global exists for the main body of code it is declared in a simple application package
`globals`. Refer to the package `README.MD` for details.


###Documentation
Overview in root `README.MD`.

Specific design decisions and general documentation specific to system parts in `_DESIGN.MD` files.
*Warning* these are live documents and may become stale over time.

###Directory structure

Code for the most global and core features is organised at the root of the project in `lib`, `client`, `server`,
`public`, `private`, `i18n`, `model` directories.

Code specific to a feature is placed in a directory `feature/XXX` (XXX being the feature's name), the structure within
the feature directory uses the familiar `client`, `server`, etc. pattern.