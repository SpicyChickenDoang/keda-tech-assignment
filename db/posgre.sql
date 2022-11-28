CREATE TABLE IF NOT EXISTS public.parkingrecord
(
    row_id smallint NOT NULL DEFAULT nextval('parkingrecord_row_id_seq'::regclass),
    vehicle_type text COLLATE pg_catalog."default" NOT NULL,
    login_time timestamp without time zone NOT NULL,
    logout_time timestamp without time zone NOT NULL,
    parking_cost bigint NOT NULL,
    CONSTRAINT parkingrecord_pkey PRIMARY KEY (row_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.parkingrecord
    OWNER to postgres;