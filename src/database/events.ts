import { AttendanceEvent } from '../typings';
import apolloClient from '../apollo';
import gql from 'graphql-tag';

const TAG = 'database/events';

export const saveEvent = (event: AttendanceEvent, messageId: string): void => {
    const variables = Object.assign(event, { messageId });

    apolloClient
        .mutate({
            variables,
            mutation: gql`
                mutation(
                    $title: String
                    $description: String
                    $startTime: Datetime
                    $endTime: Datetime
                    $userId: String
                    $guildId: String
                    $channelId: String
                    $messageId: String
                    $color: String
                    $url: String
                ) {
                    createEvent(
                        input: {
                            event: {
                                title: $title
                                description: $description
                                startTime: $startTime
                                endTime: $endTime
                                userId: $userId
                                guildId: $guildId
                                channelId: $channelId
                                messageId: $messageId
                                color: $color
                                url: $url
                            }
                        }
                    ) {
                        event {
                            rowId
                        }
                    }
                }
            `
        })
        .then(result => {
            const rowId = result.data.createEvent.event.rowId;
            console.log(`${TAG} | Saved event ${rowId}`);
        })
        .catch(error => console.error(error));
};

export const getEventByMessageId = async (messageId: string): Promise<AttendanceEvent | void> => {
    console.log(`${TAG} | Fetch event by messageId ${messageId}`);

    return await apolloClient
        .query({
            variables: { messageId },
            query: gql`
                query($messageId: String!) {
                    eventByMessageId(messageId: $messageId) {
                        rowId
                        title
                        description
                        startTime
                        endTime
                        userId
                        guildId
                        channelId
                        color
                        url
                    }
                }
            `
        })
        .then(result => {
            const data = result.data.eventByMessageId;

            if (data == null) throw `Event with messageId ${messageId} not found`;

            const { rowId, title, description, startTime, endTime, userId, guildId, channelId, color, url } = data;
            console.log(`${TAG} | Received event ${rowId} with messageId ${messageId}`);

            return <AttendanceEvent>{
                rowId,
                title,
                description,
                startTime,
                endTime,
                userId,
                guildId,
                channelId,
                color,
                url
            };
        })
        .catch(error => {
            console.error(`${TAG} | ${error}`);
            return null;
        });
};

export const getLastEventId = async (): Promise<number> => {
    return await apolloClient
        .query({
            fetchPolicy: 'no-cache',
            query: gql`
                query {
                    allEvents(last: 1) {
                        nodes {
                            rowId
                        }
                    }
                }
            `
        })
        .then(result => {
            const nodes = result.data.allEvents.nodes;
            const rowId = nodes.length > 0 ? nodes[0].rowId : 0;

            return parseInt(rowId) + 1;
        })
        .catch(error => {
            console.error(`${TAG} | error`);
            return -1;
        });
};
