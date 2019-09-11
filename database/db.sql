CREATE LANGUAGE plpgsql;

CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.modified = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE public.event_signups (
    id integer NOT NULL,
    status text,
    event_id text NOT NULL,
    user_id text NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    modified timestamp with time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.event_signups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.event_signups_id_seq OWNED BY public.event_signups.id;

CREATE TABLE public.events (
    id integer NOT NULL,
    title text,
    description text,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    user_id text,
    color text,
    guild_id text,
    channel_id text,
    message_id text,
    url text,
    created timestamp with time zone DEFAULT now(),
    modified timestamp with time zone DEFAULT now()
);

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;

CREATE TABLE public.users (
    id text NOT NULL,
    username text,
    discriminator text,
    "displayName" text
);

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

ALTER TABLE ONLY public.event_signups ALTER COLUMN id SET DEFAULT nextval('public.event_signups_id_seq'::regclass);

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);

ALTER TABLE ONLY public.event_signups
    ADD CONSTRAINT event_signups_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_message_id_key1 UNIQUE (message_id);

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX event_signups_event_id_user_id_idx ON public.event_signups USING btree (event_id, user_id);

CREATE UNIQUE INDEX events_message_id_key ON public.events USING btree (message_id);

CREATE TRIGGER events_set_timestamp BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.event_signups FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

ALTER TABLE ONLY public.event_signups
    ADD CONSTRAINT event_signups_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(message_id);

ALTER TABLE ONLY public.event_signups
    ADD CONSTRAINT event_signups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_author_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

