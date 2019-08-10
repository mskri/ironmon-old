import { Message } from 'discord.js';
import { createMessageTrigger } from '../../triggers/trigger-factory';
import { sendToChannel } from '../../utils/trigger-helpers';
// import apolloClient from '../../apollo';
// import gql from 'graphql-tag';

export default createMessageTrigger({
    name: 'sayHello',
    trigger: new RegExp(/^hello\b/),
    execute: (message: Message) => {
        sendToChannel(message.channel, `Hello ${message.author}`);

        // apolloClient
        //     .query({
        //         query: gql`
        //             query myQuery {
        //                 eventByMessageId(messageId: "516215940468178956") {
        //                     id
        //                     title
        //                     description
        //                     startTime
        //                     endTime
        //                     authorId
        //                     guildId
        //                     channelId
        //                     messageId
        //                     url
        //                 }
        //             }
        //         `
        //     })
        //     .then(result => {
        //         const data = result.data.eventByMessageId;
        //         sendToChannel(message.channel, result.data.eventByMessageId.title);
        //     });
    }
});
