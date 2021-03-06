import { AttendanceEvent } from '../types';
import apolloClient from '../apollo';
import gql from 'graphql-tag';

const TAG = 'database/events';

export const saveEvent = async (
    event: AttendanceEvent,
    messageId: string
): Promise<number | null> => {
    const variables = Object.assign(event, { messageId });

    try {
        const result = await apolloClient.mutate({
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
                            id
                        }
                    }
                }
            `
        });

        return result.data.createEvent.event.id;
    } catch (error) {
        console.error(`${TAG}/fetchEventByMessageId | ${error.message}`);
        return null;
    }
};

export const fetchEventByMessageId = async (messageId: string): Promise<AttendanceEvent | null> => {
    try {
        const result = await apolloClient.query({
            variables: { messageId },
            query: gql`
                query($messageId: String!) {
                    eventByMessageId(messageId: $messageId) {
                        id
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
        });

        const data = result.data.eventByMessageId;
        if (data == null) throw new Error(`Event with messageId ${messageId} not found`);

        const {
            id,
            title,
            description,
            startTime,
            endTime,
            userId,
            guildId,
            channelId,
            color,
            url
        } = data;

        return {
            id,
            title,
            description,
            startTime,
            endTime,
            userId,
            guildId,
            channelId,
            color,
            url
        } as AttendanceEvent;
    } catch (error) {
        console.error(`${TAG}/fetchEventByMessageId | ${error.message}`);
        return null;
    }
};

export const fetchLastEventId = async (): Promise<number> => {
    try {
        const result = await apolloClient.query({
            fetchPolicy: 'no-cache',
            query: gql`
                query {
                    allEvents(last: 1) {
                        nodes {
                            id
                        }
                    }
                }
            `
        });

        const nodes = result.data.allEvents.nodes;
        const id = nodes.length > 0 ? nodes[0].id : 0;

        return parseInt(id) + 1;
    } catch (error) {
        console.error(`${TAG}/fetchLastEventId | ${error.message}`);
        return -1;
    }
};
