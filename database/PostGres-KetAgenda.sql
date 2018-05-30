-- Exported from QuickDBD: https://www.quickdatatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/schema/ogTXOlfK502YGEAbuQ5-MQ
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "Events" (
    "Id" int   NOT NULL,
    "Name" string   NOT NULL,
    "Description" varchar(200)   NOT NULL,
    "Owner" string   NULL,
    CONSTRAINT "pk_Events" PRIMARY KEY (
        "Id"
     )
);

CREATE TABLE "Event_Group" (
    "EventId" int   NOT NULL,
    "GroupId" int   NOT NULL,
    CONSTRAINT "pk_Event_Group" PRIMARY KEY (
        "EventId","GroupId"
     )
);

CREATE TABLE "Event_User" (
    "EventId" int   NOT NULL,
    "UserId" int   NOT NULL,
    "BooleanUnSubscribe" boolean   NOT NULL,
    CONSTRAINT "pk_Event_User" PRIMARY KEY (
        "EventId","UserId"
     )
);

CREATE TABLE "Bookings" (
    "Id" int   NOT NULL,
    "EventId" int   NOT NULL,
    "Start" dateTime   NOT NULL,
    "End" dateTime   NOT NULL,
    "RoomId" int   NOT NULL,
    CONSTRAINT "pk_Bookings" PRIMARY KEY (
        "Id"
     )
);

CREATE TABLE "Rooms" (
    "Id" int   NOT NULL,
    "Name" varchar(200)   NOT NULL,
    "Description" varchar(200)   NOT NULL,
    "Floor" string   NOT NULL,
    "Number" int   NOT NULL,
    "Location" string   NOT NULL,
    CONSTRAINT "pk_Rooms" PRIMARY KEY (
        "Id"
     ),
    CONSTRAINT "uc_Rooms_Name" UNIQUE (
        "Name"
    )
);

CREATE TABLE "Groups" (
    "Id" int   NOT NULL,
    "Name" string   NOT NULL,
    "Description" varchar(200)   NOT NULL,
    CONSTRAINT "pk_Groups" PRIMARY KEY (
        "Id"
     )
);

CREATE TABLE "Group_User" (
    "GroupId" int   NOT NULL,
    "UserId" int   NOT NULL,
    "BooleanUnSubscribe" boolean   NOT NULL,
    CONSTRAINT "pk_Group_User" PRIMARY KEY (
        "GroupId","UserId"
     )
);

CREATE TABLE "Users" (
    "Id" int   NOT NULL,
    "Email" string   NOT NULL,
    "Name" string   NOT NULL,
    "Role" Type   NOT NULL,
    CONSTRAINT "pk_Users" PRIMARY KEY (
        "Id"
     ),
    CONSTRAINT "uc_Users_Email" UNIQUE (
        "Email"
    )
);

ALTER TABLE "Event_Group" ADD CONSTRAINT "fk_Event_Group_EventId" FOREIGN KEY("EventId")
REFERENCES "Events" ("Id");

ALTER TABLE "Event_Group" ADD CONSTRAINT "fk_Event_Group_GroupId" FOREIGN KEY("GroupId")
REFERENCES "Groups" ("Id");

ALTER TABLE "Event_User" ADD CONSTRAINT "fk_Event_User_EventId" FOREIGN KEY("EventId")
REFERENCES "Events" ("Id");

ALTER TABLE "Event_User" ADD CONSTRAINT "fk_Event_User_UserId" FOREIGN KEY("UserId")
REFERENCES "Users" ("Id");

ALTER TABLE "Bookings" ADD CONSTRAINT "fk_Bookings_EventId" FOREIGN KEY("EventId")
REFERENCES "Events" ("Id");

ALTER TABLE "Bookings" ADD CONSTRAINT "fk_Bookings_RoomId" FOREIGN KEY("RoomId")
REFERENCES "Rooms" ("Id");

ALTER TABLE "Group_User" ADD CONSTRAINT "fk_Group_User_GroupId" FOREIGN KEY("GroupId")
REFERENCES "Groups" ("Id");

ALTER TABLE "Group_User" ADD CONSTRAINT "fk_Group_User_UserId" FOREIGN KEY("UserId")
REFERENCES "Users" ("Id");

CREATE INDEX "idx_Events_Name"
ON "Events" ("Name");

