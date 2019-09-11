import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';

const { GRAPHQL_URL } = process.env;

const apolloClient = new ApolloClient({
    link: createHttpLink({ uri: `${GRAPHQL_URL}/graphql`, fetch: fetch }),
    cache: new InMemoryCache()
});

export default apolloClient;
