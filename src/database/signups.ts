import { Signup, SignupStatus } from '../types';
import apolloClient from '../apollo';
import gql from 'graphql-tag';

const TAG = 'database/signups';

export const saveSingup = async (
    status: SignupStatus,
    eventId: string,
    userId: string
): Promise<Signup | null> => {
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
                    createEventSignup(
                        input: {
                            eventSignup: { status: $status, eventId: $eventId, userId: $userId }
                        }
                    ) {
                        eventSignup {
                            id
                            status
                            eventId
                            userId
                        }
                    }
                }
            `
        });

        const { id, status, eventId, userId } = result.data.createEventSignup.eventSignup;

        return {
            id,
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
    console.log(12, variables);
    try {
        apolloClient.mutate({
            variables,
            mutation: gql`
                mutation($id: Int!, $status: String!, $eventId: String!, $userId: String!) {
                    updateEventSignupById(
                        input: {
                            id: $id
                            eventSignupPatch: {
                                status: $status
                                eventId: $eventId
                                userId: $userId
                            }
                        }
                    ) {
                        eventSignup {
                            id
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
                            id
                            status
                        }
                    }
                }
            `
        });

        const data = result.data.allEventSignups.nodes[0] || null;
        if (!data) throw new Error(`Signup for ${userId} on event ${eventId} not found`);

        const { id, status } = data;

        return {
            id,
            status,
            eventId,
            userId
        } as Signup;
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
                            id
                            eventId
                            status
                            userId
                        }
                    }
                }
            `
        });

        const data = result.data.allEventSignups.nodes;
        console.log(1, data);
        // TODO: check result data
        return data.map((element: any) => {
            const { id, eventId, status, userId } = element;
            return {
                id,
                eventId,
                status,
                userId
            };
        });
    } catch (error) {
        console.error(`${TAG}/getSignupsForEventByEventId | ${error}`);
        return [];
    }
};
