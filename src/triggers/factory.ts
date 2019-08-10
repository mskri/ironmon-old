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

    const hasAddReaction = (): boolean => {
        return (<ReactionTrigger>config.trigger).onAddReaction != null;
    };

    const hasRemoveReaction = (): boolean => {
        return (<ReactionTrigger>config.trigger).onRemoveReaction != null;
    };

    const onAddReaction = () => {
        const { message, reactionEvent } = config;
        const trigger = <ReactionTrigger>config.trigger;

        logExecution(config);

        if (trigger.onAddReaction == null) return;
        trigger.onAddReaction(message, reactionEvent);
    };

    const onRemoveReaction = () => {
        const { message, reactionEvent } = config;
        const trigger = <ReactionTrigger>config.trigger;

        logExecution(config);

        if (trigger.onRemoveReaction == null) return;
        trigger.onRemoveReaction(message, reactionEvent);
    };

    return {
        getType,
        onAddReaction,
        onRemoveReaction,
        hasAddReaction,
        hasRemoveReaction,
        logInit: () => logInit(config),
        isConfigured: () => isConfigured(config),
        isAllowedChannel: () => isAllowedChannel(config),
        authorHasPermissionFlags: () => authorHasPermissionFlags(config),
        authorIsAdmin: () => authorIsAdmin(config),
        authorHasPermission: () => authorHasPermission(config)
    };
};
