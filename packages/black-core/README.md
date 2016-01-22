Black Core
==========

This package, loaded after the Black globals, provides the main Core objects used by
the main system and intended for use by plugin developers to interface with the main
system.

*Note* No client side or UI code should be placed in Core. Any core UI code belongs in the `mbools:black-ui`.
This arrangement allows 3rd parties to develop packages without needing to use core UI components.

Namespace
---------

All of the Core objects are added to the `Black.Core` namespace and are provided as [stamps](https://github.com/stampit-org/stampit).

Main Core Objects
-----------------

###Black.Core.physicalDevice

`physicalDevice` should be treated as an abstract object and used to create your own device.

    let myDev = stampit({
        init() { ... },
        methods: { ... },
        props: { ... }, ...
    }).compose(Black.Core.physicalDevice);

For the most part `physicalDevice`s operate on the server only (exceptions being front-end representation for their
configuration and association with `virtualDevice`s). This is a design decision based on the logic that the
main purpose `physicalDevice` is to interact with the home's systems and these cannot be guaranteed to be available
remotely, so all `physicalDevice` interaction is mediated through the server.

####Templates

_Notes to Black device package developers._

#####enConfig<>

All `physicalDevices` must provide a configuration template or the form `enConfig<deviceName>`, 
e.g. the physicalDevice `OWLIntuitionNetwork` has a configuration template `enConfigOWLIntuitionNetwork`
which is invoked when creating or editing an OWLIntuitionNetwork device.

###Black.Core.virtualDevice

`virtualDevice` should be treated as an abstract object and used to create your own device.

Virtual devices are used for all on screen representations. Beside having a lot of screen handling
responsibilities they importantly provide the simulation behaviour.

Every `physicalDevice` has one or more associated `virtualDevices` for presentation in the main
system screens.

Exceptions to this are the main configuration screens for `physicalDevice`s.