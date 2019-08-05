import { ReactionTrigger, ReactionTriggerEvent, ReactionTriggerConfig } from '../typings';
import {
    logExecution,
    hasAdminPermissions,
    isConfigured,
    isAllowedChannel,
    authorHasPermission
} from '../utils/trigger-helpers';

export const createReactionTrigger = (reactionTrigger: ReactionTrigger): ReactionTrigger => {
    return reactionTrigger;
};

export const createReactionTriggerEvent = (config: ReactionTriggerConfig): ReactionTriggerEvent => {
    const getType = (): string => {
        return config.reactionEvent.type;
    };

    const onAddReaction = () => {
        const { trigger, message, reactionEvent } = config;
        logExecution(config);
        trigger.onAddReaction(message, reactionEvent);
    };

    const onRemoveReaction = () => {
        const { trigger, message, reactionEvent } = config;
        logExecution(config);
        trigger.onRemoveReaction(message, reactionEvent);
    };

    return {
        getType,
        onAddReaction,
        onRemoveReaction,
        isConfigured: () => isConfigured(config),
        isAllowedChannel: () => isAllowedChannel(config),
        hasAdminPermissions: () => hasAdminPermissions(config),
        authorHasPermission: () => authorHasPermission(config)
    };
};
