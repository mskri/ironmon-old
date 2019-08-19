import { GuildMember } from 'discord.js';
import { DiscordUser } from '../typings';
import apolloClient from '../apollo';
import gql from 'graphql-tag';

const TAG = 'database/users';

export const fetchUser = async (userId: string): Promise<DiscordUser> => {
    try {
        const result = await apolloClient.query({
            variables: { rowId: userId },
            fetchPolicy: 'no-cache',
            query: gql`
                query($rowId: String!) {
                    userByRowId(rowId: $rowId) {
                        rowId
                        username
                        discriminator
                        displayName
                    }
                }
            `
        });

        const data = result.data.userByRowId;
        if (!data) throw new Error(`User ${userId} not found`);

        const { rowId: id, username: username, discriminator, displayName } = data;

        return <DiscordUser>{
            id,
            username,
            discriminator,
            displayName
        };
    } catch (error) {
        console.error(`${TAG}/fetchUser | ${error.message}`);
        throw new Error(`Could not find user`);
    }
};

export const checkIfUserExists = async (userId: string): Promise<boolean> => {
    try {
        const result = await apolloClient.query({
            variables: { rowId: userId },
            fetchPolicy: 'no-cache',
            query: gql`
                query($rowId: String!) {
                    userByRowId(rowId: $rowId) {
                        rowId
                    }
                }
            `
        });

        const data = result.data.userByRowId;
        return data !== null;
    } catch (error) {
        console.error(`${TAG}/checkIfUserExists | ${error.message}`);
        return false;
    }
};

export const saveUser = async (member: GuildMember): Promise<number> => {
    const { displayName } = member;
    const { id: rowId, username, discriminator } = member.user;
    const variables = {
        rowId,
        username,
        discriminator,
        displayName
    };

    try {
        const result = await apolloClient.mutate({
            variables,
            mutation: gql`
                mutation($rowId: String!, $username: String, $discriminator: String, $displayName: String) {
                    createUser(
                        input: {
                            user: {
                                rowId: $rowId
                                username: $username
                                discriminator: $discriminator
                                displayName: $displayName
                            }
                        }
                    ) {
                        user {
                            rowId
                        }
                    }
                }
            `
        });

        const rowId = result.data.createUser.user.rowId;
        console.log(`${TAG}/saveUser | Saved user ${rowId}`);

        return rowId;
    } catch (error) {
        console.error(`${TAG}/saveUser | ${error}`);
        throw new Error('Could not save user');
    }
};

export const upsertUser = async (member: GuildMember): Promise<number | null> => {
    const userExists = await checkIfUserExists(member.id);
    if (userExists) return null;
    return await saveUser(member);
};
