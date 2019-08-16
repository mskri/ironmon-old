import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';
import { GRAPHQL_URL } from './configs/env';

const apolloClient = new ApolloClient({
    link: createHttpLink({ uri: `${GRAPHQL_URL}/graphql`, fetch: fetch }),
    cache: new InMemoryCache()
});

export default apolloClient;
