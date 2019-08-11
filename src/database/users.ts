import { DbUser, DiscordUser } from '../typings';
import apolloClient from '../apollo';
import gql from 'graphql-tag';

const TAG = 'database/users';

export const getUser = async (id: string): Promise<DbUser | null> => {
    console.log(`${TAG} | Fetch user ${id}`);

    return await apolloClient
        .query({
            variables: { rowId: id },
            fetchPolicy: 'no-cache',
            query: gql`
                query($rowId: String!) {
                    userByRowId(rowId: $rowId) {
                        rowId
                        username
                        discordUsername
                        discordDiscriminator
                    }
                }
            `
        })
        .then(result => {
            const data = result.data.userByRowId;

            if (data == null) throw `User ${id} not found`;

            const { rowId, username, discordUsername, discordDiscriminator } = data;
            console.log(`${TAG} | Received user ${rowId}`);

            return {
                id: rowId,
                username,
                discordUsername,
                discordDiscriminator
            };
        })
        .catch(error => {
            console.error(`${TAG} | ${error}`);
            return null;
        });
};

export const saveUser = (user: DiscordUser): void => {
    const { id, nickname, username, discriminator } = user;
    const variables = {
        rowId: id,
        username: nickname, // Nickname is the name user has set to be visible in the server
        discordUsername: username,
        discordDiscriminator: discriminator
    };

    apolloClient
        .mutate({
            variables,
            mutation: gql`
                mutation($rowId: String, $username: String, $discordUsername: String, $discordDiscriminator: String) {
                    createUser(
                        input: {
                            user: {
                                rowId: $rowId
                                username: $username
                                discordUsername: $discordUsername
                                discordDiscriminator: $discordDiscriminator
                            }
                        }
                    ) {
                        user {
                            id
                            rowId
                        }
                    }
                }
            `
        })
        .then(result => {
            const rowId = result.data.createUser.user.rowId;
            console.log(`${this.default.name} | Saved user ${rowId}`);
        })
        .catch(error => console.error(`${TAG} | ${error}`));
};
