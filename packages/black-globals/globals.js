// This is the only global used throughout the Black application
// Defined in this package to guarantee load order.

Black = {
    Constants: {
        deviceTypes: {
            PHYSICAL: 'physical',
            VIRTUAL: 'virtual'
        },
        detailLevel: {
            NOVICE: 0,
            INTERMEDIATE: 50,
            EXPERT: 100
        }
    }, // Duh.
    SessionVars: {
        EDITING_PHYS_DEV: 'editingphydev'   // The object for currently editing physical device
    }, // To ensure consistent application of session variable names
    Collections: {}, // Collections used throughout application (local collections used within plugins etc. are controlled locally.
    devicePlugins: {}, // Location to register a device plugin
    utilities: {},   // Utility functions in the global namespace
    Core: {}    // Core objects (these are stampit stamps)
};
