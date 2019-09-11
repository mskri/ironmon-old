import { Message, TextChannel, Guild, GuildMember, RichEmbed } from 'discord.js';
import { ActionEvent, Signup, SignupStatus } from '../../types';
import { createCommand } from '../factory';
import { getMembersWithRoleSorted, sendToChannel, editMessage } from '../helpers';
import { saveSingup, updateSignupStatus, getSignupsForEventByEventId } from '../../database/signups';
import { upsertUser } from '../../database/users';
import { createEmbedFields, createSignupNoticeEmbed } from './attendance-helpers';

const requiredRole = 'Mythic team'; // TODO: move to db (has to be in sync with !add-event)
const outputChannel = 'attendance-log';
const statusColorMap = new Map<SignupStatus, number>([['accepted', 0x69e4a6], ['declined', 0xff7285]]);

const memberHasNoStatus = (signups: Signup[], member: GuildMember): boolean => {
    return !signups.map(signup => signup.userId).includes(member.id);
};

const displayNameAlphabetically = (a: GuildMember, b: GuildMember) => a.displayName.localeCompare(b.displayName);

const emojiNameToSignupStatus = (emojiName: string): SignupStatus =>
    emojiName === 'accepted' ? 'accepted' : 'declined';

const getAcceptedSignups = (signups: Signup[], guild: Guild): GuildMember[] => {
    return signups
        .filter(signup => signup.status === 'accepted')
        .map(signup => guild.members.find(member => member.id === signup.userId))
        .sort(displayNameAlphabetically);
};

const getDeclinedSignups = (signups: Signup[], guild: Guild): GuildMember[] => {
    return signups
        .filter(signup => signup.status === 'declined')
        .map(signup => guild.members.find(member => member.id === signup.userId))
        .sort(displayNameAlphabetically);
};

const getNoStatusSignups = (signups: Signup[], membersInChannel: GuildMember[], author: GuildMember): GuildMember[] => {
    return membersInChannel
        .filter(member => memberHasNoStatus(signups, member))
        .filter(member => member.id !== author.id)
        .sort(displayNameAlphabetically);
};

export default createCommand({
    type: 'REACTION',
    name: 'eventSignupReaction',
    reactions: [
        'accepted', // :accepted:
        'declined' // :declined:
    ],
    onAddReaction: async (message: Message, event: ActionEvent, author: GuildMember) => {
        const { reaction, emojiName } = event;
        const { client, channel, guild } = message;

        if (!emojiName || !reaction) return;

        // Remove the reaction of the person who added the reaction
        reaction.remove(author);

        const newStatus: SignupStatus = emojiNameToSignupStatus(emojiName);
        const allSignups: Signup[] = await getSignupsForEventByEventId(reaction.message.id);
        let oldSignup: Signup | undefined | null = allSignups.find(signup => signup.userId == author.id);
        let oldStatus: SignupStatus | null = null;

        if (oldSignup) {
            if (oldSignup.status !== newStatus) {
                oldSignup.status = newStatus;
                updateSignupStatus(oldSignup, newStatus);
                oldStatus = oldSignup.status;
            } else {
                // Already same status do nothing
                return;
            }
        } else {
            await upsertUser(author);
            oldSignup = await saveSingup(newStatus, message.id, author.id);

            if (!oldSignup) {
                // TOODO: send error to channel?
                return;
            }

            allSignups.push(oldSignup);
        }

        const membersInChannel: GuildMember[] = getMembersWithRoleSorted(<TextChannel>channel, requiredRole);
        const noStatusUsers: GuildMember[] = getNoStatusSignups(allSignups, membersInChannel, author);
        const acceptedUsers: GuildMember[] = getAcceptedSignups(allSignups, guild);
        const declinedUsers: GuildMember[] = getDeclinedSignups(allSignups, guild);

        const eventEmbedFromMessage = reaction.message.embeds[0];
        const updatedEmbed = new RichEmbed(eventEmbedFromMessage);
        updatedEmbed.fields = createEmbedFields(acceptedUsers, declinedUsers, noStatusUsers);
        updatedEmbed.timestamp = new Date();

        editMessage(reaction.message, updatedEmbed);

        const channelsInGuild = client.guilds.find(guild => guild.id === message.guild.id).channels;
        const outChannelId = channelsInGuild.find(channel => channel.name === outputChannel).id;
        const outChannel = <TextChannel>client.channels.get(outChannelId);

        if (!outChannel) console.error('Event signup log channel not found'); // TODO inform owner via dm?

        const statusColor: number = statusColorMap.get(newStatus) || 0x000000;
        const signupEmbed = createSignupNoticeEmbed(author, oldSignup.eventRowId, statusColor, newStatus, oldStatus);
        sendToChannel(outChannel, signupEmbed);
    }
});
