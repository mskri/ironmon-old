import { Signup, SignupStatus } from '../typings';
import apolloClient from '../apollo';
import gql from 'graphql-tag';

const TAG = 'database/signups';

export const saveSingup = async (status: SignupStatus, eventId: string, userId: string): Promise<Signup | null> => {
    const variables = {
        status,
        eventId,
        userId
    };

    try {
        const result = await apolloClient.mutate({
            variables,
            mutation: gql`
                mutation($status: String!, $eventId: String!, $userId: String!) {
                    createEventSignup(input: { eventSignup: { status: $status, eventId: $eventId, userId: $userId } }) {
                        eventSignup {
                            rowId
                            status
                            eventId
                            userId
                        }
                    }
                }
            `
        });

        // TODO: check result
        const { rowId, status, eventId, userId } = result.data.createEventSignup.eventSignup;
        return <Signup>{
            rowId,
            status,
            eventId,
            userId
        };
    } catch (error) {
        console.error(`${TAG}/saveSingup | ${error.message}`);
        return null;
    }
};

export const updateSignupStatus = (signup: Signup, newStatus: SignupStatus): void => {
    const variables = Object.assign(signup, { status: newStatus });

    try {
        apolloClient.mutate({
            variables,
            mutation: gql`
                mutation($rowId: Int!, $status: String!, $eventId: String!, $userId: String!) {
                    updateEventSignupByRowId(
                        input: {
                            rowId: $rowId
                            eventSignupPatch: { status: $status, eventId: $eventId, userId: $userId }
                        }
                    ) {
                        eventSignup {
                            rowId
                        }
                    }
                }
            `
        });
    } catch (error) {
        console.error(`${TAG}/updateSignupStatus | ${error.message}`);
    }
};

export const getSignupForUser = async (userId: string, eventId: string): Promise<Signup | null> => {
    console.log(`${TAG}/getSignupForUser | Fetch signup for user ${userId} on event ${eventId}`);

    try {
        const result = await apolloClient.query({
            variables: { userId, eventId },
            fetchPolicy: 'no-cache',
            query: gql`
                query($userId: String, $eventId: String) {
                    allEventSignups(condition: { userId: $userId, eventId: $eventId }, first: 1) {
                        nodes {
                            rowId
                            status
                        }
                    }
                }
            `
        });

        const data = result.data.allEventSignups.nodes[0] || null;
        if (!data) throw new Error(`Signup for ${userId} on event ${eventId} not found`);

        const { rowId, status } = data;
        return <Signup>{
            rowId,
            status,
            eventId,
            userId
        };
    } catch (error) {
        console.error(`${TAG}/getSignupForUser | ${error.message}`);
        return null;
    }
};

export const getSignupsForEventByEventId = async (messageId: string): Promise<Signup[]> => {
    console.log(`${TAG}/getSignupsForEventByEventId | Fetch signups for messageId ${messageId}`);

    try {
        const result = await apolloClient.query({
            variables: { eventId: messageId },
            fetchPolicy: 'no-cache',
            query: gql`
                query($eventId: String!) {
                    allEventSignups(condition: { eventId: $eventId }) {
                        nodes {
                            rowId
                            eventId
                            status
                            userId
                        }
                    }
                }
            `
        });

        const data = result.data.allEventSignups.nodes;
        // TODO: check result data
        return <Signup[]>data;
    } catch (error) {
        console.error(`${TAG}/getSignupsForEventByEventId | ${error}`);
        return [];
    }
};
