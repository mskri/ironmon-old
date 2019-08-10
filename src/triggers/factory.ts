import { MessageTriggerEvent, ReactionTriggerEvent, MessageTrigger, ReactionTrigger, TriggerConfig } from '../typings';
import {
    logExecution,
    logInit,
    isConfigured,
    isAllowedChannel,
    authorHasPermissionFlags,
    authorIsAdmin,
    authorHasPermission
} from './helpers';

export const createMessageTrigger = (messageTrigger: MessageTrigger): MessageTrigger => {
    return messageTrigger;
};

export const createMessageTriggerEvent = (config: TriggerConfig): MessageTriggerEvent => {
    const execute = (): void => {
        const { trigger, message } = config;
        logExecution(config);
        (<MessageTrigger>trigger).execute(message);
    };

    return {
        execute,
        logInit: () => logInit(config),
        isConfigured: () => isConfigured(config),
        isAllowedChannel: () => isAllowedChannel(config),
        authorHasPermissionFlags: () => authorHasPermissionFlags(config),
        authorIsAdmin: () => authorIsAdmin(config),
        authorHasPermission: () => authorHasPermission(config)
    };
};

export const createReactionTrigger = (reactionTrigger: ReactionTrigger): ReactionTrigger => {
    return reactionTrigger;
};

export const createReactionTriggerEvent = (config: TriggerConfig): ReactionTriggerEvent => {
    const getType = (): string => {
        return config.reactionEvent.type;
    };

    const onAddReaction = () => {
        const { trigger, message, reactionEvent } = config;
        logExecution(config);
        (<ReactionTrigger>trigger).onAddReaction(message, reactionEvent);
    };

    const onRemoveReaction = () => {
        const { trigger, message, reactionEvent } = config;
        logExecution(config);
        (<ReactionTrigger>trigger).onRemoveReaction(message, reactionEvent);
    };

    return {
        getType,
        onAddReaction,
        onRemoveReaction,
        logInit: () => logInit(config),
        isConfigured: () => isConfigured(config),
        isAllowedChannel: () => isAllowedChannel(config),
        authorHasPermissionFlags: () => authorHasPermissionFlags(config),
        authorIsAdmin: () => authorIsAdmin(config),
        authorHasPermission: () => authorHasPermission(config)
    };
};
