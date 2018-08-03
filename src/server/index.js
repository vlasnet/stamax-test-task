export const base = {
  'events': [
    {
      id: 1,
      title: 'Stand-up',
      date: '10-06-2018 10:00',
      participants: [
        {
          id: 1,
          name: 'Витя',
          surname: 'Костин'
        },
        {
          id: 2,
          name: 'Дима',
          surname: 'Молодцов'
        }
      ]
    },
    {
      id: 2,
      title: 'Stand-up',
      date: '11-07-2018 10:40',
      participants: [
        {
          id: 1,
          name: 'Витя',
          surname: 'Костин'
        },
        {
          id: 2,
          name: 'Дима',
          surname: 'Молодцов'
        }
      ]
    },
    {
      id: 3,
      title: 'Stand-up',
      date: '12-08-2018 10:40',
      participants: [
        {
          id: 1,
          name: 'Витя',
          surname: 'Костин'
        },
        {
          id: 2,
          name: 'Дима',
          surname: 'Молодцов'
        }
      ]
    },
    {
      id: 4,
      title: 'Stand-up',
      date: '13-06-2018 10:40',
      participants: [
        {
          id: 1,
          name: 'Витя',
          surname: 'Костин'
        },
        {
          id: 2,
          name: 'Дима',
          surname: 'Молодцов'
        }
      ]
    },
    {
      id: 5,
      title: 'Stand-up',
      date: '14-08-2018 10:40',
      participants: [
        {
          id: 1,
          name: 'Витя',
          surname: 'Костин'
        },
        {
          id: 2,
          name: 'Дима',
          surname: 'Молодцов'
        }
      ]
    },
    {
      id: 6,
      title: 'Stand-up',
      date: '15-07-2018 10:40',
      participants: [
        {
          id: 1,
          name: 'Витя',
          surname: 'Костин'
        },
        {
          id: 2,
          name: 'Дима',
          surname: 'Молодцов'
        }
      ]
    },
    {
      id: 7,
      title: 'Stand-up',
      date: '16-06-2018 08:40',
      participants: [
        {
          id: 1,
          name: 'Витя',
          surname: 'Костин'
        },
        {
          id: 2,
          name: 'Дима',
          surname: 'Молодцов'
        }
      ]
    },
    {
      id: 8,
      title: 'Stand-up',
      date: '17-08-2018 08:40',
      participants: [
        {
          id: 1,
          name: 'Витя',
          surname: 'Костин'
        },
        {
          id: 2,
          name: 'Дима',
          surname: 'Молодцов'
        }
      ]
    },
    {
      id: 9,
      title: 'Stand-up',
      date: '18-07-2018 08:40',
      participants: [
        {
          id: 1,
          name: 'Витя',
          surname: 'Костин'
        },
        {
          id: 2,
          name: 'Дима',
          surname: 'Молодцов'
        }
      ]
    },
    {
      id: 10,
      title: 'Stand-up',
      date: '19-07-2018 08:40',
      participants: [
        {
          id: 1,
          name: 'Витя',
          surname: 'Костин'
        },
        {
          id: 2,
          name: 'Дима',
          surname: 'Молодцов'
        }
      ]
    }
  ]
}

export const getEventsByMonth = (db, month, year) => {
  return db.events.filter(event => event.date.includes(`${month + 1}-${year}`))
}

export const getFilteredEvents = (db, keyWord) => {
  return keyWord ? db.events.filter(event => event.title.includes(keyWord)) : []
}
