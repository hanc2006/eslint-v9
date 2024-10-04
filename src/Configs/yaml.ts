
import yml from "eslint-plugin-yml";


{
    files: ["**/*.{yml,yaml}"],
    rules: {
        "yml/file-extension": ["error", { extension: "yml" }],
        "yml/sort-keys": [
            "error",
            {
                order: { type: "asc" },
                pathPattern: "^.*$",
            },
        ],
        "yml/sort-sequence-values": [
            "error",
            {
                order: { type: "asc" },
                pathPattern: "^.*$",
            },
        ],
    },
},