Project Black
=============

A Home Automation system using Meteor (named after colour of the notebook in which it all started).

Project Organisation
--------------------

###Single Global

Project Black introduces a single variable `Black` into the global namespace, shared on both client and server. 

In order to ensure that this global exists for the main body of code it is declared in a simple application package
`globals`. Refer to the package `README.MD` for details.


###Organisation
The entire project is now broken into internal packages. This simplifies load order, separates concerns (allowing
others to more easily use the packages independently) and, in time, provide a more flexible system for testing.

The main packages are currently:


- `black-globals` as the name suggests, provides the global namespace
- `black-core` server side and core functionality.
- `black-ui` mainly client side. Provides the main UI components.

Also in here at the moment:

`black-owl-intuition-network` plugin to interface to the OWL Intuition Network device.