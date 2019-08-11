import { Signup, SignupStatus } from '../typings';
import apolloClient from '../apollo';
import gql from 'graphql-tag';

const TAG = 'database/signups';

export const saveSingup = (status: SignupStatus, eventId: string, userId: string): void => {
    const variables = {
        status,
        eventId,
        userId
    };

    apolloClient
        .mutate({
            variables,
            mutation: gql`
                mutation($status: String!, $eventId: String!, $userId: String!) {
                    createEventSignup(input: { eventSignup: { status: $status, eventId: $eventId, userId: $userId } }) {
                        eventSignup {
                            rowId
                        }
                    }
                }
            `
        })
        .then(result => {
            const rowId = result;
            console.log(`${TAG} | Saved signup for ${userId} to event ${eventId} as ${status}`);
        })
        .catch(error => console.error(`${TAG} | ${error}`));
};

export const updateSignup = (signup: Signup, newStatus: SignupStatus): void => {
    const variables = Object.assign(signup, { status: newStatus });

    apolloClient
        .mutate({
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
        })
        .then(_ => {
            const { userId, eventId } = signup;
            console.log(`${TAG} | Updated signup for ${userId} to event ${eventId} as ${newStatus}`);
        })
        .catch(error => console.error(`${TAG} | ${error}`));
};

export const getSignup = async (userId: string, messageId: string): Promise<Signup | null> => {
    console.log(`${TAG} | Fetch signup for user ${userId} on event ${messageId}`);

    return await apolloClient
        .query({
            variables: { userId, eventId: messageId },
            // fetchPolicy: 'no-cache',
            query: gql`
                query($userId: String, $eventId: String) {
                    allEventSignups(condition: { userId: $userId, eventId: $eventId }, first: 1) {
                        nodes {
                            rowId
                            status
                            eventId
                            userId
                        }
                    }
                }
            `
        })
        .then(result => {
            const data = result.data.allEventSignups.nodes[0];
            const { rowId, status, eventId, userId } = data;

            if (data.length === 0) throw `Signup for ${userId} on event ${messageId} not found`;

            console.log(`${TAG} | Received signup for ${userId} on event ${messageId}`);
            return {
                rowId,
                status,
                eventId,
                userId
            };
        })
        .catch(error => {
            console.error(`${TAG} | ${error}`);
            return null;
        });
};
