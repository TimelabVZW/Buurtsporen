const options = {
    typePolicies: {
        Query: {
            fields: {
                markers: {
                    keyArgs: ['id', '__typename'],
                    merge(existing = [], incoming: any[], { args }: { args: { id: number, __typename: string } }) {
                        return incoming;
                    },
                },
                timestamps: {
                    keyArgs: ['id', '__typename'],
                    merge(existing = [], incoming: any[], { args }: { args: { id: number, __typename: string } }) {
                        return incoming;
                    },
                },
                icons: {
                    keyArgs: ['id', '__typename'],
                    merge(existing = [], incoming: any[], { args }: { args: { id: number, __typename: string } }) {
                        return incoming;
                    },
                },
                coordinates: {
                    keyArgs: ['id', '__typename'],
                    merge(existing = [], incoming: any[], { args }: { args: { id: number, __typename: string } }) {
                        return incoming;
                    },
                },
                layers: {
                    keyArgs: ['id', '__typename'],
                    merge(existing = [], incoming: any[], { args }: { args: { id: number, __typename: string } }) {
                        return incoming;
                    },
                },
            },
        },
    },
};

export default options;