import { EventData, EventMeta } from '../typings';
import apolloClient from '../apollo';
import gql from 'graphql-tag';
import { Message } from 'discord.js';

const TAG = 'database/events';

export const saveEvent = (eventData: EventData, eventMeta: EventMeta): void => {
    const variables = Object.assign(eventData, eventMeta);

    apolloClient
        .mutate({
            variables,
            mutation: gql`
                mutation(
                    $title: String
                    $description: String
                    $startTime: Datetime
                    $endTime: Datetime
                    $authorId: String
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
                                authorId: $authorId
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

export const getEventByMessageId = async (messageId: string): Promise<EventData | null> => {
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
                        authorId
                        guildId
                        channelId
                        color
                        url
                    }
                }
            `
        })
        .then(result => {
            return result.data.eventByMessageId;
        })
        .catch(error => console.error(`${TAG} | ${error}`));
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
