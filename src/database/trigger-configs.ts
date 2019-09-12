import { TriggerConfig } from '../types';
import apolloClient from '../apollo';
import gql from 'graphql-tag';

const fetchTriggerConfigGroups = async (guildId?: string): Promise<TriggerConfig[]> => {
    const results = await apolloClient.query({
        variables: { guildId },
        fetchPolicy: 'cache-first',
        query: gql`
            query {
                allTriggerConfigGroups {
                    nodes {
                        id
                        guildId
                        triggers
                        channelsWhitelisted
                        channelsBlacklisted
                        rolesWhitelisted
                        rolesBlacklisted
                        permissionFlags
                        options
                    }
                }
            }
        `
    });

    const nodes = results.data.allTriggerConfigGroups.nodes;
    if (!nodes) return [];

    return nodes;
};

export const getAllTriggerConfigGroups = async (): Promise<TriggerConfig[]> => {
    try {
        const configGroups = await fetchTriggerConfigGroups();

        return configGroups.map((node: any) => {
            const {
                triggers,
                guildId,
                channelsWhitelisted,
                channelsBlacklisted,
                rolesWhitelisted,
                rolesBlacklisted,
                permissionFlags,
                options
            } = node;

            // TODO: check that required things are returned? Does it need to be checked, database enforces defaults + not nulls
            // ! Could the 'shaping of data' be done in graphql or just even change the format to match grapqhl one so there is no need for this?

            return {
                triggers,
                guildId,
                channels: {
                    whitelisted: channelsWhitelisted,
                    blacklisted: channelsBlacklisted
                },
                roles: {
                    whitelisted: rolesWhitelisted,
                    blacklisted: rolesBlacklisted
                },
                permissionFlags,
                options: options
            };
        });
    } catch (error) {
        console.error(`getAllTriggerConfigGroups | ${error.message}`);
        throw new Error(`Could not find trigger configs`);
    }
};

const mapToTriggerConfig = (triggerConfig: any): TriggerConfig => {
    const {
        triggers,
        guildId,
        channelsWhitelisted,
        channelsBlacklisted,
        rolesWhitelisted,
        rolesBlacklisted,
        permissionFlags,
        options
    } = triggerConfig;

    return {
        triggers,
        guildId,
        channels: {
            whitelisted: channelsWhitelisted,
            blacklisted: channelsBlacklisted
        },
        roles: {
            whitelisted: rolesWhitelisted,
            blacklisted: rolesBlacklisted
        },
        permissionFlags,
        options
    };
};

export const getTriggerConfig = async (
    guildId: string,
    triggerName: string
): Promise<TriggerConfig | null> => {
    try {
        const configGroups = await fetchTriggerConfigGroups(guildId);
        const triggerConfig = configGroups.find((node: any) => node.triggers.includes(triggerName));

        if (!triggerConfig) return null;

        return mapToTriggerConfig(triggerConfig);
    } catch (error) {
        console.error(`getAllTriggerConfigGroups | ${error.message}`);
        throw new Error(`Could not find trigger configs`);
    }
};
