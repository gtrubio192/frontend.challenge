import React, { ReactElement, useContext, useMemo, useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import greeting from 'lib/greeting'
import Calendar from 'src/models/Calendar'
import Event from 'src/models/Event'
import AccountContext from 'src/context/accountContext'
import List from './List'
import EventCell from './EventCell'
import runEvery from 'lib/runEvery'
import useHour from 'lib/useHour'
import style from './style.scss'

const FIVE_MIN_INTERVAL = 300000

type AgendaItem = {
  calendar: Calendar
  event: Event
}

const compareByDateTime = (a: AgendaItem, b: AgendaItem) =>
  a.event.date.diff(b.event.date).valueOf()

/**
 * Agenda component
 * Displays greeting (depending on time of day)
 * and list of calendar events
 */

const Agenda = (): ReactElement => {
  const account = useContext(AccountContext)
  const [hour, setHour] = useHour()
  const [calendars, setCalendar] = useState([])
  const [dropdownFilter, setDropdownFilter] = useState<string | null>(null)
  const [filteredEvents, setFilteredEvents] = useState<AgendaItem[]>()

  useEffect(() => {
    const cals = account.calendars.map((calendar) => calendar.id)
    setCalendar(cals)
  }, [account])

  useEffect(() => {
    if(dropdownFilter === '' || dropdownFilter === null) {
      setFilteredEvents(events)
    }
    else {
      const filterCalendar = events.filter((event) => event.calendar.id === dropdownFilter)
      setFilteredEvents(filterCalendar)
    }
  }, [dropdownFilter])

  const events: AgendaItem[] = useMemo(
    () =>
      account.calendars
        .flatMap((calendar) =>
          calendar.events.map((event) => ({ calendar, event })),
        )
        .sort(compareByDateTime),
    [account],
  )
  
  /**
   * Bug fix: Pass in a dependency to useMemo in order to trigger a re-render.
   *    Previously with no dependency, this variable 'title' only updated on mount
   *    Utilizing the handy runEvery function to run a chron job to update the greeting
   */ 
  runEvery(FIVE_MIN_INTERVAL, setHour)
  const title = useMemo(() => greeting(DateTime.local().hour), [hour])

  /**
   * New feature: Filter agenda events by calendar
   */
  const handleEventFilter = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    console.log(e.target.value)
    setDropdownFilter(e.target.value)
  }


  return (
    <div className={style.outer}>
      <div className={style.container}>
        <div className={style.header}>
          <span className={style.title}>{title}</span>
        </div>
        <div className={style.controls}>
          <div className={style.control}>
            <label>Filter by Calendar</label>
            <select
              className={style.dropdown}
              onChange={handleEventFilter}
            >
              <option value={null}></option>
              {
                calendars.map((id) => (
                  <option key={id} value={id}>Calendar: {id}</option>
                ))
              }
            </select>
          </div>
          {/* Note: Ran out of time to implement this toggle */}
          <div className={style.control}>
            <label>Group by Department</label>
            <button onClick={()=> {}}>Group</button>
          </div>
        </div>
        <List>
          {
            !account.errorMessage && filteredEvents
            ? filteredEvents.map(({ calendar, event }) => (
                <EventCell key={event.id} calendar={calendar} event={event} />
              ))
            : <div className={style.error}>
                <p>Whoops!</p>
                <p>Something went wrong fetching your calendars, we'll be right back...</p>
              </div>
          }
        </List>
      </div>
    </div>
  )
}

export default Agenda
