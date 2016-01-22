This package presents a global object containing the following sections to the main Black project code.

Collections
-----------

Any global collections used throughout the project.

**Note** An collections used exclusively within specific features, for example device plugins, should be declared in
that feature's organisational structure and not globally. This will facilitate modularisation (when it finally arrives).

utilities
---------

A simple way to centralise some general purpose functions.

Constants
---------

Fairly obviously, global constants.

devicePlugins
-------------

A central location into which `devicePlugins` are registered at startup, making them available to the core.