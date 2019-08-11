import { SignupStatus } from '../typings';
import apolloClient from '../apollo';
import gql from 'graphql-tag';

const TAG = 'database/signups';

export const saveSingup = (status: SignupStatus, eventId: number, userId: string): void => {
    const variables = {
        status,
        eventId,
        userId
    };

    apolloClient
        .mutate({
            variables,
            mutation: gql`
                mutation($status: String!, $eventId: Int!, $userId: Int!) {
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
