import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'cross-fetch';
import { createHttpLink } from 'apollo-link-http';

const apolloClient = new ApolloClient({
    link: createHttpLink({ uri: 'http://localhost:5000/graphql', fetch: fetch }),
    cache: new InMemoryCache()
});

export default apolloClient;
