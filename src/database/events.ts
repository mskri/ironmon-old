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
                            rowId
                        }
                    }
                }
            `
        });

        const rowId = result.data.createEvent.event.rowId;
        return rowId;
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
        });

        const data = result.data.eventByMessageId;
        if (data == null) throw new Error(`Event with messageId ${messageId} not found`);

        const {
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
        } = data;

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
                            rowId
                        }
                    }
                }
            `
        });

        const nodes = result.data.allEvents.nodes;
        const rowId = nodes.length > 0 ? nodes[0].rowId : 0;

        return parseInt(rowId) + 1;
    } catch (error) {
        console.error(`${TAG}/fetchLastEventId | ${error.message}`);
        return -1;
    }
};
