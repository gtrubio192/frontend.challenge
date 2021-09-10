import React, { ReactElement, useContext, useMemo, useState } from 'react'
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

const HOUR_INTERVAL = 3600000

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

  runEvery(HOUR_INTERVAL, setHour)

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
   * Bug fix: pass in a dependency to useMemo in order to trigger a re-render.
   *    Previously with no dependency, this variable 'title' only updated on mount
   */
  const title = useMemo(() => greeting(DateTime.local().hour), [hour])

  return (
    <div className={style.outer}>
      <div className={style.container}>
        <div className={style.header}>
          <span className={style.title}>{title}</span>
        </div>

        <List>
          {
            account.errorMessage
            ? <div className={style.error}>
                <span className={style.title}>Whoops! Problem refreshing your account</span>
              </div>
            : events.map(({ calendar, event }) => (
                <EventCell key={event.id} calendar={calendar} event={event} />
              ))
          }
        </List>
      </div>
    </div>
  )
}

export default Agenda
