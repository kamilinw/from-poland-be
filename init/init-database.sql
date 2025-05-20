CREATE DATABASE from_poland_db;

CREATE USER from_poland_user WITH ENCRYPTED PASSWORD 'frompoland123';

ALTER USER from_poland_user CREATEDB;
ALTER DATABASE from_poland_db OWNER TO from_poland_user;

GRANT ALL ON DATABASE from_poland_db TO from_poland_user;

\connect from_poland_db;