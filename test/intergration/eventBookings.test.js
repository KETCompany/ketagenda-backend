try {
  if (!init) {
    require('../../server');
  }
} catch (err) {
  require('../../server');
}

init = true;

const sinon = require('sinon');
const assert = require('assert');

const business = require('../../src/api/business/event.business');

const eventRepository = require('../../src/api/repositories/EventRepository');
const bookingRepository = require('../../src/api/repositories/BookingRepository');
const roomRepository = require('../../src/api/repositories/RoomRepository');

const notificationHandler = require('../../src/api/utils/notificationHandler');

const Logger = require('../../src/api/utils/logger');

let roomId = '';
describe('eventBookings test', () => {
  before((done) => {
    sinon
      .stub(notificationHandler, 'sendToDevice')
      .callsFake(() => { });
    sinon
      .stub(Logger, 'info')
      .callsFake(() => {
      });

    roomRepository.create({
      department: 'CMI',
      floor: '4',
      type: 'Scret',
      description: 'dasjdas',
      name: 'TESTING ROOM SECRET',
      number: 1234,
    })
      .then((room) => {
        roomId = room._id;
        done();
      });
  });


  describe('event creation without bookings', () => {
    let createdEventId = '';

    const createEvent = {
      name: 'TEST-event',
      description: 'TEST-event-description',
    };

    it('should create a event', () =>
      business.create(createEvent)
        .then((event) => {
          createdEventId = event._id;
          assert(event.name === createEvent.name);
          return assert(event.description === createEvent.description);
        }));

    it('should remove the event', () => {
      return eventRepository.remove(createdEventId)
        .then((removed) => {
          return assert(removed);
        });
    });
  });

  describe('event creation with bookings', () => {
    let createdEventId = '';
    let bookingsIds = [];
    let createEvent;

    before(() => {
      createEvent = {
        name: 'TEST-event',
        description: 'TEST-event-description',
        bookings: [
          {
            start: 1628169256,
            end: 1628169556,
            room: roomId,
          },
        ],
      };
    });

    it('should create a event', () =>
      business.create(createEvent)
        .then((event) => {
          createdEventId = event._id;
          bookingsIds = event.bookings;
          assert(event.name === createEvent.name);
          assert(event.description === createEvent.description);
          return assert(event.bookings.length === 1);
        }).catch(err => console.log(err)));

    it('should give a error because has bookings the event', () => {
      return eventRepository.remove(createdEventId)
        .catch((err) => { 
          return assert(err);
        });
    });

    it('should remove the bookings', () => {
      bookingRepository.remove(createdEventId)
        .then((res) => {
          return assert(res);
        });
    });

    it('should not throw a error', () => {
      return eventRepository.remove(createdEventId)
        .then(suc =>
          assert(suc));
    });
  });

  describe('event creation -> update', () => {
    let createdEventId = '';

    let createEvent;
    let createEventUpdate;

    before(() => {
      createEventUpdate = {
        name: 'TEST-event-update',
        description: 'TEST-event-description',
      };
      createEvent = {
        name: 'TEST-event',
        description: 'TEST-event-description',
      };
    });

    it('should create a event', () =>
      business.create(createEvent)
        .then((event) => {
          createdEventId = event._id;
          assert(event.name === createEvent.name);
          return assert(event.description === createEvent.description);
        }));


    it('should update a event', () =>
      business.update(createdEventId, createEventUpdate)
        .then((updatedEvent) => {
          assert(updatedEvent.name === createEventUpdate.name);
          return assert(updatedEvent.description === createEventUpdate.description);
        }));


    it('should not throw a error', () => {
      return eventRepository.remove(createdEventId)
        .then(suc =>
          assert(suc));
    });
  });

  describe('event creation -> update more bookings', () => {
    let createdEventId = '';
    let createEvent;
    let createEventUpdate;
    let bookingsIds = [];

    before(() => {
      createEventUpdate = {
        name: 'TEST-event-update',
        description: 'TEST-event-description',
        bookings: [
          {
            start: 1628169256,
            end: 1628169556,
            room: roomId,
          },
        ],
      };
      createEvent = {
        name: 'TEST-event',
        description: 'TEST-event-description',
        bookings: [
          {
            start: 1628169257,
            end: 1628169558,
            room: roomId,
          },
        ],
      };
    });

    it('should create a event', () =>
      business.create(createEvent)
        .then((event) => {
          createdEventId = event._id;
          bookingsIds = event.bookings;
          assert(event.name === createEvent.name);
          return assert(event.description === createEvent.description);
        }));


    it('should update a event', () =>
      business.update(createdEventId, createEventUpdate)
        .then((updatedEvent) => {
          assert(updatedEvent.name === createEventUpdate.name);
          assert(updatedEvent.bookings.length === 1);
          return assert(updatedEvent.description === createEventUpdate.description);
        }));

    it('should remove the bookings', () => {
      return bookingRepository.remove(createdEventId)
        .then((res) => {
          return assert(res.n === 1);
        });
    });

    it('should not throw a error', () => {
      return eventRepository.remove(createdEventId)
        .then(suc =>
          assert(suc));
    });
  });

  describe('event creation -> update if no bookings', () => {
    let createdEventId = '';
    let createEvent;
    let createEventUpdate;

    before(() => {
      createEventUpdate = {
        name: 'TEST-event-update',
        description: 'TEST-event-description',
        bookings: [
          {
            start: 1628169256,
            end: 1628169556,
            room: roomId,
          },
        ],
      };
      createEvent = {
        name: 'TEST-event',
        description: 'TEST-event-description',
      };
    });

    it('should create a event', () =>
      business.create(createEvent)
        .then((event) => {
          createdEventId = event._id;
          assert(event.name === createEvent.name);
          return assert(event.description === createEvent.description);
        }));


    it('should update a event', () =>
      business.update(createdEventId, createEventUpdate)
        .then((updatedEvent) => {
          assert(updatedEvent.name === createEventUpdate.name);
          assert(updatedEvent.bookings.length === 1);
          return assert(updatedEvent.description === createEventUpdate.description);
        }));

    it('should remove the bookings', () => {
      return bookingRepository.remove(createdEventId)
        .then((res) => {
          return assert(res.n === 1);
        });
    });

    it('should not throw a error', () => {
      return eventRepository.remove(createdEventId)
        .then(suc =>
          assert(suc));
    });
  });

  describe('event creation -> update to no bookings', () => {
    let createdEventId = '';
    let createEvent;
    let createEventUpdate;

    before(() => {
      createEventUpdate = {
        name: 'TEST-event-update',
        description: 'TEST-event-description',
        bookings: [],
      };
      createEvent = {
        name: 'TEST-event',
        description: 'TEST-event-description',
        bookings: [
          {
            start: 1628169256,
            end: 1628169556,
            room: roomId,
          },
        ],
      };
    });
    
    it('should create a event', () =>
      business.create(createEvent)
        .then((event) => {
          createdEventId = event._id;
          assert(event.name === createEvent.name);
          return assert(event.description === createEvent.description);
        }));


    it('should update a event', () =>
      business.update(createdEventId, createEventUpdate)
        .then((updatedEvent) => {
          assert(updatedEvent.name === createEventUpdate.name);
          assert(updatedEvent.bookings.length === 0);
          return assert(updatedEvent.description === createEventUpdate.description);
        }));

    it('should be no bookings for this event', () => {
      bookingRepository.getByEventId(createdEventId)
        .then(res =>
          assert(res.length === 0));
    });

    it('should not throw a error', () => {
      return eventRepository.remove(createdEventId)
        .then(suc =>
          assert(suc));
    });
  });

  describe('event creation -> update to no bookings', () => {
    let createdEventId = '';
    let createEvent;
    let createEventUpdate;

    before(() => {
      createEventUpdate = {
        name: 'TEST-event-update',
        description: 'TEST-event-description',
        bookings: [
          {
            start: 1628169256,
            end: 1628169556,
            room: roomId,
          },
          {
            start: 1628169252,
            end: 1628169556,
            room: roomId,
          },
        ],
      };
      createEvent = {
        name: 'TEST-event',
        description: 'TEST-event-description',
        bookings: [
          {
            start: 1628169256,
            end: 1628169556,
            room: roomId,
          },
        ],
      };
    });

    it('should create a event', () =>
      business.create(createEvent)
        .then((event) => {
          createdEventId = event._id;
          assert(event.name === createEvent.name);
          return assert(event.description === createEvent.description);
        }));


    it('should update a event', () =>
      business.update(createdEventId, createEventUpdate)
        .then((updatedEvent) => {
          assert(updatedEvent.name === createEventUpdate.name, 'name should be the same');
          return assert(updatedEvent.description === createEventUpdate.description, 'description should be updated');
        }));

    it('should remove the bookings', () =>
      bookingRepository.remove(createdEventId)
        .then((res) => {
          return assert(res);
        }));

    it('should not throw a error', () => {
      return eventRepository.remove(createdEventId)
        .then(suc =>
          assert(suc))
    });
  });


  describe('event creation -> twice will fail', () => {
    let createdEventIdFirst = '';
    let createEvent;
    
    before(() => {
      createEvent = {
        name: 'TEST-event',
        description: 'TEST-event-description',
        bookings: [
          {
            start: 1628169256,
            end: 1628169556,
            room: roomId,
          },
        ],
      };
    });

    it('should create a error', () =>
      business.create(createEvent)
        .then((event) => {
          createdEventIdFirst = event._id;
          return business.create(createEvent);
        }).catch(err => assert(err)));

    it('should remove the bookings', () =>
      bookingRepository.remove(createdEventIdFirst)
        .then((res) => {
          return assert(res);
        }));

    it('should not throw a error', () => {
      return eventRepository.remove(createdEventIdFirst)
        .then(suc =>
          assert(suc));
    });
  });

  after(() => {
    Logger.info.restore();
    notificationHandler.sendToDevice.restore();
    return roomRepository.remove(roomId);
  });
});
