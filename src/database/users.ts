import { GuildMember } from 'discord.js';
import { DiscordUser } from '../types';
import apolloClient from '../apollo';
import gql from 'graphql-tag';

const TAG = 'database/users';

export const fetchUser = async (userId: string): Promise<DiscordUser> => {
    try {
        const result = await apolloClient.query({
            variables: { id: userId },
            fetchPolicy: 'no-cache',
            query: gql`
                query($id: String!) {
                    userById(id: $id) {
                        id
                        username
                        discriminator
                        displayName
                    }
                }
            `
        });

        const data = result.data.userById;
        if (!data) throw new Error(`User ${userId} not found`);

        const { id, username: username, discriminator, displayName } = data;

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
            variables: { id: userId },
            fetchPolicy: 'no-cache',
            query: gql`
                query($id: String!) {
                    userById(id: $id) {
                        id
                    }
                }
            `
        });

        const data = result.data.userById;
        return data !== null;
    } catch (error) {
        console.error(`${TAG}/checkIfUserExists | ${error.message}`);
        return false;
    }
};

export const saveUser = async (member: GuildMember): Promise<number> => {
    const { displayName } = member;
    const { id, username, discriminator } = member.user;
    const variables = {
        id,
        username,
        discriminator,
        displayName
    };

    try {
        const result = await apolloClient.mutate({
            variables,
            mutation: gql`
                mutation(
                    $id: String!
                    $username: String
                    $discriminator: String
                    $displayName: String
                ) {
                    createUser(
                        input: {
                            user: {
                                id: $id
                                username: $username
                                discriminator: $discriminator
                                displayName: $displayName
                            }
                        }
                    ) {
                        user {
                            id
                        }
                    }
                }
            `
        });

        const id = result.data.createUser.user.id;
        console.log(`${TAG}/saveUser | Saved user ${id}`);

        return id;
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
