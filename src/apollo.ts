import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';

const { GRAPHQL_ENDPOINT_HOST } = process.env;

const apolloClient = new ApolloClient({
    link: createHttpLink({
        uri: `http://${GRAPHQL_ENDPOINT_HOST}:5000/graphql`,
        fetch: fetch
    }),
    cache: new InMemoryCache()
});

export default apolloClient;
