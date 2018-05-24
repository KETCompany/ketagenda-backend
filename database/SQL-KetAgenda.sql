-- Exported from QuickDBD: https://www.quickdatatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/schema/ogTXOlfK502YGEAbuQ5-MQ
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


SET XACT_ABORT ON

BEGIN TRANSACTION QUICKDBD

CREATE TABLE [Events] (
    [Id] int  NOT NULL ,
    [Name] string  NOT NULL ,
    [Description] varchar(200)  NOT NULL ,
    [Owner] string  NULL ,
    CONSTRAINT [PK_Events] PRIMARY KEY CLUSTERED (
        [Id] ASC
    )
)

CREATE TABLE [Event_Group] (
    [EventId] int  NOT NULL ,
    [GroupId] int  NOT NULL ,
    CONSTRAINT [PK_Event_Group] PRIMARY KEY CLUSTERED (
        [EventId] ASC,[GroupId] ASC
    )
)

CREATE TABLE [Event_User] (
    [EventId] int  NOT NULL ,
    [UserId] int  NOT NULL ,
    [BooleanUnSubscribe] boolean  NOT NULL ,
    CONSTRAINT [PK_Event_User] PRIMARY KEY CLUSTERED (
        [EventId] ASC,[UserId] ASC
    )
)

CREATE TABLE [Bookings] (
    [Id] int  NOT NULL ,
    [EventId] int  NOT NULL ,
    [Start] dateTime  NOT NULL ,
    [End] dateTime  NOT NULL ,
    [RoomId] int  NOT NULL ,
    CONSTRAINT [PK_Bookings] PRIMARY KEY CLUSTERED (
        [Id] ASC
    )
)

CREATE TABLE [Rooms] (
    [Id] int  NOT NULL ,
    [Name] varchar(200)  NOT NULL ,
    [Description] varchar(200)  NOT NULL ,
    [Floor] string  NOT NULL ,
    [Number] int  NOT NULL ,
    [Location] string  NOT NULL ,
    CONSTRAINT [PK_Rooms] PRIMARY KEY CLUSTERED (
        [Id] ASC
    ),
    CONSTRAINT [UK_Rooms_Name] UNIQUE (
        [Name]
    )
)

CREATE TABLE [Groups] (
    [Id] int  NOT NULL ,
    [Name] string  NOT NULL ,
    [Description] varchar(200)  NOT NULL ,
    CONSTRAINT [PK_Groups] PRIMARY KEY CLUSTERED (
        [Id] ASC
    )
)

CREATE TABLE [Group_User] (
    [GroupId] int  NOT NULL ,
    [UserId] int  NOT NULL ,
    [BooleanUnSubscribe] boolean  NOT NULL ,
    CONSTRAINT [PK_Group_User] PRIMARY KEY CLUSTERED (
        [GroupId] ASC,[UserId] ASC
    )
)

CREATE TABLE [Users] (
    [Id] int  NOT NULL ,
    [Email] string  NOT NULL ,
    [Name] string  NOT NULL ,
    [Role] Type  NOT NULL ,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED (
        [Id] ASC
    ),
    CONSTRAINT [UK_Users_Email] UNIQUE (
        [Email]
    )
)

ALTER TABLE [Event_Group] WITH CHECK ADD CONSTRAINT [FK_Event_Group_EventId] FOREIGN KEY([EventId])
REFERENCES [Events] ([Id])

ALTER TABLE [Event_Group] CHECK CONSTRAINT [FK_Event_Group_EventId]

ALTER TABLE [Event_Group] WITH CHECK ADD CONSTRAINT [FK_Event_Group_GroupId] FOREIGN KEY([GroupId])
REFERENCES [Groups] ([Id])

ALTER TABLE [Event_Group] CHECK CONSTRAINT [FK_Event_Group_GroupId]

ALTER TABLE [Event_User] WITH CHECK ADD CONSTRAINT [FK_Event_User_EventId] FOREIGN KEY([EventId])
REFERENCES [Events] ([Id])

ALTER TABLE [Event_User] CHECK CONSTRAINT [FK_Event_User_EventId]

ALTER TABLE [Event_User] WITH CHECK ADD CONSTRAINT [FK_Event_User_UserId] FOREIGN KEY([UserId])
REFERENCES [Users] ([Id])

ALTER TABLE [Event_User] CHECK CONSTRAINT [FK_Event_User_UserId]

ALTER TABLE [Bookings] WITH CHECK ADD CONSTRAINT [FK_Bookings_EventId] FOREIGN KEY([EventId])
REFERENCES [Events] ([Id])

ALTER TABLE [Bookings] CHECK CONSTRAINT [FK_Bookings_EventId]

ALTER TABLE [Bookings] WITH CHECK ADD CONSTRAINT [FK_Bookings_RoomId] FOREIGN KEY([RoomId])
REFERENCES [Rooms] ([Id])

ALTER TABLE [Bookings] CHECK CONSTRAINT [FK_Bookings_RoomId]

ALTER TABLE [Group_User] WITH CHECK ADD CONSTRAINT [FK_Group_User_GroupId] FOREIGN KEY([GroupId])
REFERENCES [Groups] ([Id])

ALTER TABLE [Group_User] CHECK CONSTRAINT [FK_Group_User_GroupId]

ALTER TABLE [Group_User] WITH CHECK ADD CONSTRAINT [FK_Group_User_UserId] FOREIGN KEY([UserId])
REFERENCES [Users] ([Id])

ALTER TABLE [Group_User] CHECK CONSTRAINT [FK_Group_User_UserId]

CREATE INDEX [idx_Events_Name]
ON [Events] ([Name])

COMMIT TRANSACTION QUICKDBD