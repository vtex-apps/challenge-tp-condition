import React, { FC, useEffect, Fragment, useState } from 'react'
import {
  useRuntime,
  SessionUnauthorized,
  Session,
  SessionForbidden,
} from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'
import checkProfileAllowedQuery from './graphql/checkProfileAllowed.graphql'
import { getSession } from './modules/session'

type ContentVisibility = 'visible' | 'hidden'

const useRedirect = (condition: boolean, path: string) => {
  const { navigate } = useRuntime()

  useEffect(() => {
    if (condition) {
      navigate({
        to: path,
      })
    }
  }, [condition, navigate, path])
}

type SessionResponse = Session | SessionUnauthorized | SessionForbidden

const useSessionResponse = () => {
  const [session, setSession] = useState<SessionResponse>()
  const sessionPromise = getSession()

  useEffect(() => {
    if (!sessionPromise) {
      return
    }

    sessionPromise.then(sessionResponse => {
      const response = sessionResponse.response as SessionResponse

      setSession(response)
    })
  }, [sessionPromise])

  return session
}

const useSessionUnauthorized = (
  sessionResponse: SessionResponse | undefined
) => {
  if (sessionResponse === undefined) {
    return null
  }

  return sessionResponse &&
    (sessionResponse as SessionUnauthorized).type &&
    (sessionResponse as SessionUnauthorized).type.toLowerCase() ===
      'unauthorized'
    ? true
    : false
}

const useSessionForbidden = (sessionResponse: SessionResponse | undefined) => {
  if (sessionResponse === undefined) {
    return null
  }

  return sessionResponse &&
    (sessionResponse as SessionForbidden).type &&
    (sessionResponse as SessionForbidden).type.toLowerCase() === 'forbidden'
    ? true
    : false
}

interface Props {
  redirectPath: string
  forbiddenRedirectPath: string
  defaultContentVisibility: ContentVisibility
}

type UserConditionType = 'authorized' | 'unauthorized' | 'forbidden'

const useProfileAllowed = (skip: boolean): UserConditionType | null => {
  const { loading, data, error } = useQuery(checkProfileAllowedQuery, {
    ssr: false,
    skip,
  })

  return !loading && data && !error ? data.checkProfileAllowed.condition : null
}

const ChallengeTradePolicyCondition: FC<Props> = ({
  redirectPath = '/login',
  forbiddenRedirectPath = redirectPath,
  defaultContentVisibility = 'visible',
  children,
}) => {
  const sessionResponse = useSessionResponse()
  const isUnauthorized = useSessionUnauthorized(sessionResponse)
  const isForbidden = useSessionForbidden(sessionResponse)

  const skipProfileCheck =
    // Still checking for session
    (isUnauthorized === null && isForbidden === null) ||
    // We already know that it's not possible
    isUnauthorized === true ||
    isForbidden === true

  const profileCondition = useProfileAllowed(skipProfileCheck)

  useRedirect(
    isUnauthorized === true || profileCondition === 'unauthorized',
    redirectPath
  )
  useRedirect(
    isForbidden === true || profileCondition === 'forbidden',
    forbiddenRedirectPath
  )

  const defaultHidden =
    defaultContentVisibility === 'hidden' &&
    (isUnauthorized === null || isForbidden === null)

  if (
    defaultHidden ||
    isUnauthorized === true ||
    isForbidden === true ||
    profileCondition === 'unauthorized' ||
    profileCondition === 'forbidden'
  ) {
    return null
  }

  return <Fragment>{children}</Fragment>
}

export default React.memo(ChallengeTradePolicyCondition)
